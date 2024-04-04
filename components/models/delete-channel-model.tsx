'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import qs from 'query-string'
import axios from 'axios'

import { Button } from "@/components/ui/button";

import { useModal } from '@/hooks/use-model-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DeleteChannelModel = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { refresh, push } = useRouter();

  const [loading, setLoading] = useState(false);

  const { channel, server } = data;

  const isModelOpen = isOpen && type === 'deleteChannel';

  const onConfirm = async () => {
    try {
      setLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      });

      await axios.delete(url);

      onClose();

      refresh();

      push(`/servers/${server?.id}`);
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
              Delete Channel
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className=' text-center text-zinc-500'>
            Are you sure you want to do this? <br />
            <span
              className=' font-semibold text-indigo-500'
            >{channel?.name}
            </span> will be premanetly deleted
          </DialogDescription>
          <DialogFooter className=' bg-gray-100 px-6 py-4'>
            <div className=' flex items-center justify-between w-full'>
              <Button
                disabled={loading}
                onClick={onClose}
                variant={'ghost'}
              >
                cancel
              </Button>
              <Button
                disabled={loading}
                onClick={onConfirm}
                variant={'primary'}
              >
                confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteChannelModel;