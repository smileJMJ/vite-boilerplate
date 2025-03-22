interface IImageOptions {
  imageSrc: string;
  alt?: string;
}

const Image = ({ imageSrc, alt = "" }: IImageOptions) => {
  return imageSrc
    ? `<figure class="image-wrap"><img src=${imageSrc} alt="${alt}" /></figure>`
    : "";
};

export default Image;
