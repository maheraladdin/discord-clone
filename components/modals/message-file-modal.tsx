"use client";

import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ModalType, useModal } from "@/hooks/use-modal";

const formSchema = z.object({
  fileUrl: z
    .string()
    .min(1, "Attachment URL is required.")
    .url("Attachment URL must be a valid URL."),
});

export default function MessageFileModal() {
  const {
    isOpen,
    type,
    closeModal,
    data: { apiUrl, query },
  } = useModal();
  const isModalOpen = isOpen && type === ModalType.MESSAGE_FILE;
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl as string,
        query,
      });
      await axios.post(url, { ...values, content: values.fileUrl });
      reset();
      router.refresh();
      closeModal();
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Add an attachment
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={"space-y-8"}>
            <div className={"space-y-8 px-6"}>
              <div className={"flex items-center justify-center text-center"}>
                <FormField
                  {...register("fileUrl")}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint={"messageFile"}
                            value={field.value}
                            onChange={field.onChange}
                            alt={"Uploaded Attachment"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button
                variant={"primary"}
                type={"submit"}
                disabled={isSubmitting}
                className={"w-full md:w-auto"}
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
