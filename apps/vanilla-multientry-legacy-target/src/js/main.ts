import Header from "@components/Header";
import Contents from "@components/Contents";
import Bg from "@components/Bg";
import Image from "@components/Image";

/**
 * assets을 src/img, src/svg에서 가져오는 경우
 * -> 파일 경로를 절대 경로/baseUrl 기준 상대 경로로 입력한다.
 */

import usagiImg from "@img/logo/usagi-src-img.png"; // 절대 경로
import viteSvg from "../svg/vite-src.svg"; // 상대 경로

const TYPE = {
  MAIN: "main",
  SUB: "sub",
};

const Main = () => {
  const appEle = document.createElement("div");
  const type = { ...TYPE, sub2: "sub2" };

  console.log("== type ==", type?.MAIN);

  appEle?.insertAdjacentHTML(
    "beforeend",
    `${Header({
      logoOptions: {
        imageSrc: usagiImg,
        title: "헤더 로고",
        link: "/",
      },
    })}${Contents(`
      <h1>Main!</h1>
      <div class="bg-css-wrap"><!-- CSS background: url() 로 배경 처리--></div>
      ${Bg(viteSvg)}`)}
      ${Image({
        imageSrc: new URL("@svg/icon-src.svg", import.meta.url)?.toString(), // 별도 import 없이 바로 url 사용
      })}
      ${Image({
        imageSrc: "/src/img/profile/profile-src-img.png", // 별도 import 없이 바로 url 사용
      })}`
  );

  return appEle;
};

export default Main();
