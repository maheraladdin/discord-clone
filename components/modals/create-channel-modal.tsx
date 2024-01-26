"use client";

import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ChannelType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name is required.")
    .max(100, "Channel name must be less than 100 characters.")
    .refine((name) => name !== "general", "Channel name can't be 'general'"),
  type: z.nativeEnum(ChannelType),
});

export default function CreateChannelModal() {
  const {
    isOpen,
    type,
    closeModal,
    data: { channelType },
  } = useModalStore();
  const isModalOpen = isOpen && type === ModalType.CREATE_CHANNEL;
  const router = useRouter();
  const params = useParams();
  const serverId = params?.serverId;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: "",
      type: channelType || ChannelType.TEXT,
    });
  }, [channelType]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: { serverId },
      });
      await axios.post(url, values);
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
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={"space-y-8"}>
            <div className={"space-y-8 px-6"}>
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
                        Channel name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"my awesome channel name"}
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
              <FormField
                {...register("type")}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Channel Type</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={
                              "border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0"
                            }
                          >
                            <SelectValue
                              placeholder={"Select A Channel Type"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              value={type}
                              key={type}
                              className={"capitalize"}
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                className={"w-full md:w-auto"}
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
