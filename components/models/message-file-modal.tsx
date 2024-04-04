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
  FormField,
  FormItem,
} from "@/components/ui/form";

import qs from 'query-string';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FileUpload from '@/components/shared/FileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-model-store';

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required",
  }),
})

const MessageFileModal = () => {
  const { refresh } = useRouter()
  const { isOpen, onClose, type, data } = useModal();

  const isModelOpen = isOpen && type === 'messageFile';

  const { apiUrl, query } = data

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const { isSubmitting: isLoading } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query
      })
      await axios.post(url, {
        ...values,
        content: values.fileUrl
      });
      form.reset();
      // update server component
      refresh();

      handleClose();
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
              Add an attachment
            </DialogTitle>
            <DialogDescription className=' text-center text-zinc-500'>
              Send a file as a message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=' space-y-8 px-6'>

                <div className=' flex justify-center items-center text-center'>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint='messageFile'
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button
                  variant={'primary'}
                  disabled={isLoading}
                  type="submit"
                >
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MessageFileModal;