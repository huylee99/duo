import { type PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";
import { type ROLE } from "~/server/db/schema";

import useMediaQuery from "~/hooks/use-media-query";

import { useSession } from "next-auth/react";

export type LINKS = {
  id: number;
  categoryName: string;
  links: {
    id: string;
    url: string;
    name: string;
    icon: JSX.Element;
    role?: ROLE[];
  }[];
}[];

const Menu: React.FC<{ links: LINKS }> = ({ links }) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const session = useSession();

  return (
    <div className="space-y-8">
      {links.map(category => (
        <div key={category.id} className="px-4">
          <h2 className="mb-2 px-2 text-lg font-semibold text-primary">{category.categoryName}</h2>
          <div className="space-y-2">
            {category.links.map(link => {
              if (link.role && !link.role.includes(session.data?.user.role!)) {
                return null;
              }

              return (
                <Button key={link.id} variant={currentRoute === link.url ? "default" : "ghost"} size="sm" className="w-full justify-start" asChild>
                  <Link href={link.url}>
                    {link.icon} <span>{link.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const SideBar: React.FC<{ links: LINKS }> = ({ links }) => {
  return (
    <div className="hidden border-r px-4 py-8 lg:block lg:w-80 lg:shrink-0">
      <Menu links={links} />
    </div>
  );
};

const FlexLayout: React.FC<PropsWithChildren<{ links?: LINKS }>> = ({ children, links }) => {
  return (
    <div className="flex h-[calc(100vh-61px)] w-full">
      {links && <SideBar links={links} />}
      <div className="w-full flex-1 overflow-auto p-4 lg:p-8">{children}</div>
    </div>
  );
};

export default FlexLayout;
