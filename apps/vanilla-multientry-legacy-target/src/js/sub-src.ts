import Header from "@components/Header";
import Contents from "@components/Contents";
import Bg from "@components/Bg";
import Image from "@components/Image";

/**
 * assets을 public에서 가져오는 경우
 */

const Sub = () => {
  const appEle = document.createElement("div");

  appEle?.insertAdjacentHTML(
    "beforeend",
    `${Header({
      logoOptions: {
        imageSrc: "/img/logo/usagi-public-img.png", // public 폴더의 assets은 / 루트 기준으로 작성해주면 됨
        title: "헤더 로고",
        link: "/",
      },
    })}${Contents(`
      <h1>Sub!!</h1>
      ${Bg(`/img/profile/profile.png`)}`)}
      ${Image({
        imageSrc: "@public/img/profile/profile-public-img.png",
      })}`
  );

  return appEle;
};

export default Sub();
