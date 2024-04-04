import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/server-header";
import ServerSearch from "@/components/server/server-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./ServerMember";


interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({
  serverId,
}: ServerSidebarProps) => {

  const profile = await currentProfile();

  if (!profile) {
    return redirect('/')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc'
        }
      }
    },
  });

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter((member) => member.profile.id !== profile.id)

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;


  const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
  };

  const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className=" h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className=" h-4 w-4 mr-2 text-rose-500" />,
  }

  return (
    <div className=" flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className=" flex-1 px-3">
        <div className=" mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Chennel',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Voice Chennel',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Video Chennel',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
          <Separator className=" bg-zinc-200 dark:bg-slate-700 rounded-md my-2" />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                channelType={ChannelType.TEXT}
                sectionType="channels"
                role={role}
                label='Text Channels'
              />
              <div className=" space-y-[2px]">
                {textChannels.map((channel, i) => (
                  <ServerChannel
                    key={i}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )}
          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection
                channelType={ChannelType.AUDIO}
                sectionType="channels"
                role={role}
                label='Voice Channels'
              />
              <div className=" space-y-[2px]">
                {audioChannels.map((channel, i) => (
                  <ServerChannel
                    key={i}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )}
          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection
                channelType={ChannelType.VIDEO}
                sectionType="channels"
                role={role}
                label='Video Channels'
              />
              <div className=" space-y-[2px]">
                {videoChannels.map((channel, i) => (
                  <ServerChannel
                    key={i}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
              </div>
            </div>
          )}
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                role={role}
                label='Members'
                server={server}
              />
              <div className=" space-y-[2px]">
                {members.map((member, i) => (
                  <ServerMember
                    member={member}
                    server={server}
                    key={i}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
}

export default ServerSidebar;