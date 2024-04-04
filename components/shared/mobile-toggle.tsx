import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import { Button } from "@/components/ui/button";
import NavigationSidebar from "@/components/navigation/NavigationSidebar";
import ServerSidebar from "../server/server-sidebar";


interface MobileToggleProps {
  serverId: string
}


const MobileToggle = ({
  serverId
}: MobileToggleProps) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={'ghost'} size={'icon'} className="md:hidden mr-3">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className=" p-0 flex gap-0">
          <div className=" w-[72]">
            <NavigationSidebar />
          </div>
          <ServerSidebar serverId={serverId} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileToggle;