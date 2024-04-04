'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import axios from 'axios'
import { Button } from "@/components/ui/button";

import { useModal } from '@/hooks/use-model-store';
import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';

const InviteModel = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);

  const origin = useOrigin();

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const isModelOpen = isOpen && type === 'invite';

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000)
  }

  const onNew = async () => {
    try {
      setLoading(true);
      const res = axios.patch(`/api/server/${server?.id}/invite-code`);

      onOpen('invite', { server: (await res).data })

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      <Dialog open={isModelOpen} onOpenChange={onClose}>
        <DialogContent className='bg-white text-black p-0 overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className=' text-2xl text-center font-bold'>
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className=' p-6'>
            <Label
              className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
            >
              Server Invite Link
            </Label>
            <div className=' flex items-center mt-2 gap-x-2'>
              <Input
                disabled={loading}
                className=' bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                value={inviteUrl}
              />
              <Button
                disabled={loading}
                onClick={onCopy}
                size='icon'
              >
                {copied
                  ? <Check className='w-4 h-4' />
                  : <Copy className='w-4 h-4' />
                }
              </Button>
            </div>
            <Button
              disabled={loading}
              onClick={onNew}
              className=' text-xs text-zinc-500 mt-4'
            >
              Genreate new link
              <RefreshCcw className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InviteModel;