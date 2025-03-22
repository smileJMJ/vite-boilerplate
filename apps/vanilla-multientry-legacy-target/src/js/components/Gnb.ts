interface IGnbOptions {
  data: { name: string; link: string }[];
}

const Gnb = ({ data }: IGnbOptions) => {
  console.log("== data ==", data);
  if (!Array.isArray(data) || data.length === 0) {
    return "";
  }

  return `<nav class="gnb-section">
    <ul>
      ${data
        ?.map((v) => `<li><a href='${v?.link ?? "#"}'>${v?.name}</a></li>`)
        ?.join("")}
    </ul>
  </nav>`;
};

export default Gnb;
