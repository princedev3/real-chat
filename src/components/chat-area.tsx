"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/chat-store";
import { useSessionStore } from "@/store/session-provider";
import { useCreateMessage } from "@/hooks/use-create-message-hook";
import { Message } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";
import toast from "react-hot-toast";
import { format } from "date-fns";

const ChatArea = () => {
  const [messagaeArray, setMessageArray] = useState<Message[]>([]);

  const chatId = useChatStore((state) => state.chats?.id);
  const name = useChatStore((state) => state.chats?.name);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      if (chatId) {
        const messages = await fetch(`/api/chats/${chatId}/messages`);
        const data = await messages.json();
        setMessageArray(data);
      }
    };
    fetchMessages();

    const channel = pusherClient.subscribe("chat-channel");

    channel.bind("update-chat", (message: any) => {
      if (message.chatId === Number(chatId)) {
        setMessageArray((prev) => [...prev, message]);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  const user = useSessionStore((state) => state.session?.user);
  const FormSchema = z.object({
    message: z.string().min(1, {
      message: "message must be at least 1 characters.",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });
  const createMessage = useCreateMessage({
    apiUrl: "/api/chats",
    queryKey: "createMessage",
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!chatId) {
      toast.error("Please select a chat to send message");
      return;
    }
    await (
      await createMessage
    ).mutateAsync({
      chatId: Number(chatId) as number,
      text: data.message as string,
      userId: Number(user?.id) as number,
    });
    form.reset();
  }
  if (!chatId || !name) {
    return (
      <div className="bg-gray-100 p-4 rounded-md text-center text-2xl font-semibold">
        No chat selected
      </div>
    );
  }

  return (
    <div className="shadow-md p-4 rounded-md border">
      <div className="mb-3 flex justify-between items-center">
        <p className="text-gray-900 capitalize text-lg ">{name as string} </p>
      </div>
      <div className="max-h-[60vh]  overflow-y-scroll no-scrollbar pr-2 ">
        {messagaeArray.map((message, index) => {
          return (
            <div
              key={index}
              className={` ${Number(message.userId) !== Number(user?.id) ? "items-end" : "items-start"} flex  mb-2 flex-col`}
            >
              <p className="text-gray-500 text-base ">{message.text}</p>
              <span className="text-gray-500 text-[11px] ">
                {format(new Date(message.createdAt), "yyyy-MM-dd")}{" "}
              </span>
            </div>
          );
        })}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-[1fr_auto]   border"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="enter your message"
                    className="w-full border-none h-10  rounded-none outline-none focus:outline-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className=" bg-blue-500 min-w-[100px] hover:bg-blue-800 text-white rounded-none  h-10"
            variant="default"
          >
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatArea;
