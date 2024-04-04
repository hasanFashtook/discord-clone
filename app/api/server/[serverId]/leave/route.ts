import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        // only admin can modify the server
        profileId: {
          not: profile.id
        },
        // check if the member is a part of members
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      // felete a user that match profile id
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    });

    return NextResponse.json(server);

  } catch (err) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}