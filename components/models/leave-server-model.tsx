'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import axios from 'axios'
import { Button } from "@/components/ui/button";

import { useModal } from '@/hooks/use-model-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LeaveServerModel = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { refresh, push } = useRouter()

  const [loading, setLoading] = useState(false);

  const { server } = data;

  const isModelOpen = isOpen && type === 'leaveServer';

  const onConfirm = async () => {
    try {
      setLoading(true);

      await axios.patch(`/api/server/${server?.id}/leave`);

      onClose();

      refresh()

      push('/')
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
              Leave Server
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className=' text-center text-zinc-500'>
            Are you sure to leave <span
              className=' font-semibold text-indigo-500'
            >{server?.name}</span>
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

export default LeaveServerModel;