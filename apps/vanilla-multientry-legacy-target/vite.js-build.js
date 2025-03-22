import { defineConfig, build as viteBuild } from "vite";
import banner from "vite-plugin-banner";
// import legacy from "vite-legacy-plugin";
import pkg from "./package.json" assert { type: "json" };
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const commitHash = execSync("git rev-parse --short HEAD").toString().trim(); // 커밋 해시 추출

// src/js내 1뎁스 폴더명 추출 - 폴더 내 entry 파일명이 다르거나 특정 폴더 파일을 제외하고 싶을 때 사용
// 예외 처리 하지 않을 경우 build.rollupOptions.input 에 추가하면 됨
const getJsModuleData = () => {
  const jsPath = resolve(__dirname, "src/js");
  let data = {};
  try {
    fs.readdirSync(jsPath)
      .filter((file) => fs.statSync(resolve(jsPath, file)).isDirectory())
      .map((folder) => {
        if (!/^repository|common|util$/g.test(folder)) {
          data[`js/${folder}/${folder}`] = resolve(
            __dirname,
            `src/js/${folder}/app.js`
          );
        }
      });
  } catch (e) {
    console.error("=== src/js 내 폴더를 찾을 수 없습니다. ===", e);
  }

  return data;
};

const build = async (entry, filesrc) => {
  const config = defineConfig({
    base: "./",
    build: {
      // target default('module'): ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
      emptyOutDir: false, // dist 폴더 비우지 않게
      sourcemap: true,
      assetsInlineLimit: 0, // 0으로 설정하여 모든 에셋을 파일로 저장
      rollupOptions: {
        input: filesrc,
        output: {
          format: "iife", // <script>로 임베드 후 바로 실행될 수 있도록
          inlineDynamicImports: true,
          entryFileNames: `${entry}.js`,
          chunkFileNames: `chunk/${entry}.js`,
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
    plugins: [
      banner({
        outDir: "./dist/",
        content: `/**\n * Name: ${pkg.name}\n * Version: v${
          pkg.version
        }\n * Commit: ${commitHash}\n * Update: ${new Date().toLocaleString(
          "ko"
        )}\n */`,
      }),
      // legacy 플러그인 추가 시
      // legacy({
      //   renderLegacyChunks: true,
      // }),
    ],
  });

  try {
    await viteBuild(config);
    console.log(`Successfully built ${entry}`);
  } catch (e) {
    console.error(`Error building ${entry}:`, e);
  }
};

const jsBuild = async () => {
  console.time("=== js build: parallel ===");
  const target = Object.entries(getJsModuleData());

  // 순차적 빌드
  // for (const [entry, filesrc] of target) {
  //   await build(entry, filesrc);
  // }

  // 또는 병렬로 빌드
  await Promise.all(target.map(([entry, filesrc]) => build(entry, filesrc)));
  console.timeEnd("=== js build: parallel ===");
};

jsBuild()
  .then(() => {
    console.log("All builds completed");
  })
  .catch((err) => {
    console.error(`Build failed: `, err);
    process.exit(1);
  });
