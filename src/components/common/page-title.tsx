const PageTitle: React.FC<{ title: string }> = props => {
  return (
    <div className="my-16">
      <h2 className="font-bold text-6xl">{props.title}</h2>
    </div>
  );
};

export default PageTitle;
