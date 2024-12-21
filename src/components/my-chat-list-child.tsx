"use client";
import { useChatStore } from "@/store/chat-store";
import { User } from "@prisma/client";
import React from "react";
import { Button } from "./ui/button";

const MyChatListChild = ({ user, chatId }: { user: User; chatId: number }) => {
  const { setOpen, setActiveChatId, chats } = useChatStore();
  const handleOpen = async () => {
    setOpen(true);
    setActiveChatId({ id: Number(chatId), name: user.name as string });
  };

  return (
    <div className="cursor-pointer" onClick={handleOpen} key={user.id}>
      <Button variant={"outline"} className="capitalize">
        {" "}
        {user.name}
      </Button>
    </div>
  );
};

export default MyChatListChild;
