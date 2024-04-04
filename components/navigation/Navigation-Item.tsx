'use client'
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation'

import { cn } from "@/lib/utils";
import NavigationAction from "@/components/navigation/Navigation-action";
import ActionTooltip from "../action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem = ({
  id,
  imageUrl,
  name
}: NavigationItemProps) => {
  const params = useParams();

  const { push } = useRouter();

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <button
        onClick={() => push(`/servers/${id}`)}
        className="group relative flex items-center"
      >
        <div className={cn(
          'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
          params?.serverId === id
            ? 'h-[36px]'
            : 'h-[8px] group-hover:h-[20px]'
        )} />
        <div className={cn(
          'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all  overflow-hidden',
          params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
        )}>
          <Image
            fill
            alt="Channel"
            src={imageUrl}
          />
        </div>

      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;