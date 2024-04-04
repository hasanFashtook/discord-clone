'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import qs from 'query-string'

import axios from 'axios'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-model-store';
import { ChannelType } from '@prisma/client';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Channel name is required",
  }).refine(
    name => name !== 'general',
    {
      message: "Channel name cannot be 'general'"
    }
  ),
  type: z.nativeEnum(ChannelType)
})

const EditChannelModel = () => {
  const { refresh } = useRouter();



  const { isOpen, onClose, type, data } = useModal();

  const { server, channel } = data

  const isModelOpen = isOpen && type === 'editChannel';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT
    }
  });

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    } else {
      form.setValue('type', ChannelType.TEXT)
    }
  }, [channel, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        }
      });

      await axios.patch(url, values);
      form.reset();
      refresh();
      onClose();
    } catch (err) {
      console.log(err)
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  }


  return (
    <>
      <Dialog open={isModelOpen} onOpenChange={handleClose}>
        <DialogContent className='bg-white text-black p-0 overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className=' text-2xl text-center font-bold'>
              Edit Channel
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=' space-y-8 px-6'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                      >
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Inter channel name"
                          className=' bg-zinc-300/50  border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                      >
                        Channel Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={field.disabled}
                      >
                        <FormControl>
                          <SelectTrigger className=" bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type, i) => (
                            <SelectItem
                              key={i}
                              value={type}
                              className=' capitalize'
                            >
                              {type.toLocaleLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>


              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button
                  variant={'primary'}
                  disabled={isLoading}
                  type="submit"
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditChannelModel;