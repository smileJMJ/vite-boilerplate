import Logo, { type ILogoOptions } from "@components/Logo";
// import Gnb from "@components/Gnb";
// import GnbData from "@data/GnbData.json";

interface IHeaderOption {
  logoOptions: ILogoOptions;
}

const Header = ({ logoOptions }: IHeaderOption) => {
  // return `<section class="header-section">
  //   ${Logo(logoOptions)}
  //   ${Gnb({
  //     data: GnbData?.data,
  //   })}
  // </section>`;
  return `<section class="header-section">
    ${Logo(logoOptions)}
  </section>`;
};

export default Header;
