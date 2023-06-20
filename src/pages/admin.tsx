import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "~/server/utils/auth";
import { Session } from "next-auth";
import { NextPageWithLayout } from "./_app";
import { authorizedRoles } from "~/utils/authorized-roles";
import CommonLayout from "~/layout/common-layout";

const AUTHORIZED_ROLES = authorizedRoles(["admin", "user"]);

export const getServerSideProps: GetServerSideProps<{ session: Session }> = async context => {
  const auth = await getServerAuthSession(context);

  if (!auth) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (!AUTHORIZED_ROLES.includes(auth.user.role)) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: auth,
    },
  };
};

const Admin: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ session }) => {
  return (
    <div>
      <h1>Admin</h1>
      <p>Logged in as {session.user.email}</p>
    </div>
  );
};

Admin.getLayout = function (page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Admin;
