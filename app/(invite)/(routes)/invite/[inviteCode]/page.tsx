import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect('/')
  }

  // check if a user is already a part of this server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/server/${existingServer.id}`)
  }

  const server = await db.server.update({
    // seacrh on server that corrsponding the id
    where: {
      inviteCode: params.inviteCode,
    },
    // create a new member
    data: {
      members: {
        create: {
          profileId: profile.id,
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return (
    null
  );
}

export default InviteCodePage;