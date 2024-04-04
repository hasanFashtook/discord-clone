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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from 'react';
import FileUpload from '@/components/shared/FileUpload';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
})

const InitialModel = () => {
  const { refresh } = useRouter()
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const { isLoading } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post('/api/server', values);
      form.reset();
      // update server component
      refresh();
      window.location.reload();
    } catch (err) {

    }
  }

  if (!isMounted) {
    return null
  }


  return (
    <>
      <Dialog open>
        <DialogContent className='bg-white text-black p-0 overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className=' text-2xl text-center font-bold'>
              Customize your server
            </DialogTitle>
            <DialogDescription className=' text-center text-zinc-500'>
              Give your server a personality with a name and
              an image. you can alawys change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=' space-y-8 px-6'>

                <div className=' flex justify-center items-center text-center'>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint='serverImage'
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                      >
                        Server Image
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Inter server name"
                          className=' bg-zinc-300/50  border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
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
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InitialModel;