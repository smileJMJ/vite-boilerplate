export interface ILogoOptions {
  imageSrc: string;
  title: string;
  link: string;
}

const Logo = ({ imageSrc, title, link }: ILogoOptions) => {
  const content = `${imageSrc ? `<img src="${imageSrc}" alt=""/>` : ""}
      ${title ? `<span class="hidden">${title}</span>` : ""}`;

  return `<div class="logo-wrap">
    <h1>
      ${link ? `<a href=${link}>${content}</a>` : content}
    </h1>
  </div>`;
};

export default Logo;
