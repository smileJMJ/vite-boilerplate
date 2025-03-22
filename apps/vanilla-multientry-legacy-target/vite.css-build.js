import { defineConfig, build as viteBuild } from "vite";
import autoprefixer from "autoprefixer";
import banner from "vite-plugin-banner";
import { Logger as sassLogger } from "sass";
import pkg from "./package.json" assert { type: "json" };
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

const getCssModuleData = () => {
  const scssPath = resolve(__dirname, "src/scss");
  let data = {};
  try {
    // src/scss 내 1뎁스 파일명 추출
    fs.readdirSync(scssPath)
      .filter((file) => fs.statSync(resolve(scssPath, file)).isFile())
      .map((file) => {
        const fileName = file?.split(".scss")[0];
        data[`${fileName}`] = resolve(__dirname, `src/scss/${file}`);
      });
  } catch (e) {
    console.error("=== src/js 내 폴더를 찾을 수 없습니다. ===", e);
  }

  return data;
};

const cssBuild = async () => {
  const config = defineConfig({
    base: "./",
    build: {
      emptyOutDir: false, // dist 폴더 비우지 않게
      sourcemap: true,
      assetsInlineLimit: 0, // 0으로 설정하여 모든 에셋을 파일로 저장
      rollupOptions: {
        input: {
          ...getCssModuleData(),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "js/chunk/[name].js",
          assetFileNames: (assetInfo) => {
            const originalFileName = assetInfo?.originalFileNames[0]; // ex. /src/img/logo/test.png
            const name = assetInfo?.names[0];
            const fileFullDir = originalFileName?.includes(name)
              ? originalFileName
              : name; // index.html에서 <link /> 연결한 css의 경우, names: [index.css], originFileNames: [index.html] 처럼 아예 다른 경우가 있었음
            const fileDir = fileFullDir?.replace(/^src\//, ""); // ex. img/logo/test.png

            // css 파일과 기타 에셋의 출력 경로 설정
            if (/\.(css)$/i.test(fileDir)) {
              return `css/${fileDir}`;
            }

            return fileDir;
          },
        },
      },
    },
    resolve: {
      alias: {
        "@js": resolve(__dirname, "src/js"),
        "@scss": resolve(__dirname, "src/scss"),
        "@img": resolve(__dirname, "src/img"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@scss/base/_index.scss";',
          sourceMap: true,
          logger: sassLogger.silent, // sass log 미노출
        },
      },
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    plugins: [
      banner({
        outDir: "./dist/",
        content: `/**\n * Name: ${pkg.name}\n * Version: v${
          pkg.version
        }\n * Commit: ${commitHash}\n * Update: ${new Date().toLocaleString(
          "ko"
        )}\n */`,
      }),
    ],
  });

  try {
    console.time("=== css build ===");
    await viteBuild(config);
    console.timeEnd("=== css build ===");
  } catch (e) {
    console.error(`Error building`, e);
  }
};

cssBuild()
  .then(() => {
    console.log("All SCSS builds completed");
  })
  .catch((err) => {
    console.error(`Build SCSS failed: `, err);
    process.exit(1);
  });
