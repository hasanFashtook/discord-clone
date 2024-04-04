import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "@/components/navigation/Navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/Navigation-Item";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { UserButton } from "@clerk/nextjs";


const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });


  return (
    <div
      className=" space-y-3 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#e3e5e8] py-3"
    >
      <NavigationAction />
      <Separator className=" h-[2px] w-10 dark:bg-zinc-700 bg-zinc-300 rounded-md mx-auto" />
      <ScrollArea className=" flex-1 w-full">
        {servers.map((server, i) => (
          <div key={i} className=" mb-3">
            <NavigationItem
              key={i}
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className=" pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]'
            }
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;