"use client";
import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServerSideBarTypes } from "@/components/types";
import { Plus, Smile } from "lucide-react";

type ChatInputProps = {
  apiURL: string;
  query: Record<string, any>;
  name: string;
  type: ServerSideBarTypes;
};

const formSchema = z.object({
  content: z.string().min(1).max(2000),
});

export default function ChatInput({
  apiURL,
  query,
  name,
  type,
}: ChatInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
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
        url: apiURL,
        query,
      });
      await axios.post(url, values, {
        timeout: 10000,
      });
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          {...register("content")}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className={"relative p-4 pb-6"}>
                    <button
                      type={"button"}
                      className={
                        "absolute left-8 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500 transition-all hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                      }
                      disabled={isSubmitting}
                    >
                      <Plus
                        className={"h-4 w-4 text-white dark:text-[#313338]"}
                      />
                    </button>
                    <Input
                      disabled={isSubmitting}
                      className={
                        "border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 caret-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200 dark:caret-zinc-200"
                      }
                      placeholder={`Message ${type === ServerSideBarTypes.MEMBER ? name : `#${name}`}`}
                      {...field}
                    />
                    <button type={"button"} className="absolute right-8 top-7">
                      <Smile
                        className={
                          "text-zinc-500 transition-all hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                        }
                      />
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}
