const PageHeader = (props: React.PropsWithChildren) => {
  return <h1 className="my-16 text-4xl font-semibold">{props.children}</h1>;
};

export default PageHeader;
