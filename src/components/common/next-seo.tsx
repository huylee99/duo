import { type NextSeoProps, NextSeo } from "next-seo";

const NextSeoWrapper: React.FC<NextSeoProps> = props => {
  return <NextSeo {...props} titleTemplate="%s | chưa biết .gg" defaultTitle="Chưa biết .gg" />;
};

export default NextSeoWrapper;
