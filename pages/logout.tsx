import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { deleteAccount } from "utils/database-handler";

export default function Page() {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const harvestId = `${session.harvestId}`;

  await deleteAccount(harvestId);

  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};
