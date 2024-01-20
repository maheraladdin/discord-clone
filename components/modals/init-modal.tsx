"use client";

import { z } from "zod";
import { useIsClient } from "usehooks-ts";
import { useForm } from "react-hook-form";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Server name is required.")
    .max(100, "Server name must be less than 100 characters."),
  imgUrl: z
    .string()
    .min(1, "Image URL is required.")
    .url("Image URL must be a valid URL."),
});

export function InitModal() {
  const router = useRouter();
  const isClient = useIsClient();
  const [isOpened, setIsOpened] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);
      reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  if (!isClient) return null;

  return (
    <Dialog
      defaultOpen={isOpened}
      open={isOpened}
      onOpenChange={() => setIsOpened(true)}
      modal={false}
    >
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Customize your server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Give your server personality by adding a name and image. you can
            always change these later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={"space-y-8"}>
            <div className={"space-y-8 px-6"}>
              <div className={"flex items-center justify-center text-center"}>
                <FormField
                  {...register("imgUrl")}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint={"serverImage"}
                            value={field.value}
                            onChange={field.onChange}
                            alt={watch("name")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormField
                {...register("name")}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel
                        className={
                          "text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70"
                        }
                      >
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"my awesome server name"}
                          className={
                            "border-0 bg-zinc-300/50 text-black caret-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                          }
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button
                variant={"primary"}
                type={"submit"}
                disabled={isSubmitting}
                className={"w-full"}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
