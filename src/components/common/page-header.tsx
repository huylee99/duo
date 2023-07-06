import { cn } from "~/lib/utils";

const PageHeader = (props: React.ComponentProps<"header">) => {
  return <h1 className={cn("text-4xl font-semibold", props.className)}>{props.children}</h1>;
};

export default PageHeader;
