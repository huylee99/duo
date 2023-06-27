import { Session } from "next-auth";
import { NextPageWithLayout } from "../_app";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { authorizedRoles } from "~/utils/authorized-roles";
import { getServerAuthSession } from "~/server/utils/auth";
import CommonLayout from "~/layout/common-layout";
import SettingsLayout from "~/layout/user-edit-layout";
import NextSeoWrapper from "~/components/common/next-seo";
import UpdateAvatar from "~/components/settings/update-avatar";
import UpdateUsername from "~/components/settings/update-username";
import UpdateBanner from "~/components/settings/update-banner";
import UpdateProfile from "~/components/settings/update-profile";
import UpdateBio from "~/components/settings/update-bio";
import UpdateSocials from "~/components/settings/update-socials";
import { api } from "~/server/utils/api";

const AUTHORIZED_ROLES = authorizedRoles(["partner", "user"]);

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

const Profile: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ session }) => {
  const { isLoading, data } = api.user.me.useQuery();

  return (
    <>
      <NextSeoWrapper title="Thông tin cá nhân" />
      {data && (
        <div className="w-full lg:max-w-3xl space-y-8">
          <h2 className="text-2xl font-bold text-primary">Thông tin cá nhân</h2>
          <UpdateAvatar avatar={data.image!} />
          <UpdateBanner banner={data.banner} />
          <UpdateUsername username={data.username} />
          <UpdateProfile name={data.name} shortBio={data.shortBio} />
          <UpdateBio content={data.longBio} />
          <UpdateSocials discord={data.discord} facebook={data.facebook} instagram={data.instagram} />
        </div>
      )}
    </>
  );
};

Profile.getLayout = (page: React.ReactElement) => {
  return (
    <CommonLayout>
      <SettingsLayout>{page}</SettingsLayout>
    </CommonLayout>
  );
};

export default Profile;
