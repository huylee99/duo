import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerAuthSession } from "~/server/utils/auth";
import { Session } from "next-auth";

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

  return {
    props: {
      user: auth.user,
    },
  };
};

function Admin({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>Admin</h1>
      <p>Logged in as {user.email}</p>
    </div>
  );
}

export default Admin;
