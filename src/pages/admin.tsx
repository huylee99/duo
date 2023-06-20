import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "~/server/utils/auth";
import { Session } from "next-auth";
import { NextPageWithLayout } from "./_app";
import { authorizedRoles } from "~/utils/authorized-roles";

const AUTHORIZED_ROLES = authorizedRoles(["admin"]);

export const getServerSideProps: GetServerSideProps<{ user: Session["user"] }> = async context => {
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
      user: auth.user,
    },
  };
};

const Admin: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <div>
      <h1>Admin</h1>
      <p>Logged in as {user.email}</p>
    </div>
  );
};

export default Admin;
