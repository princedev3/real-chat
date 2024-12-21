import prisma from "@/prisma/Prismadb";
import React from "react";
import MyChatListChild from "./my-chat-list-child";
import { auth } from "@/auth";

const MyChatList = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const mychatFriends = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: Number(session?.user?.id),
        },
      },
    },
    include: {
      users: true,
    },
  });

  const result = mychatFriends.map((chat) => {
    const secondUser = chat.users.find(
      (user) => Number(user.id) !== Number(session?.user?.id)
    );
    return {
      id: chat.id,
      userIds: chat.userIds,
      secondUser,
    };
  });

  return (
    <>
      {result.map((chat) => (
        <MyChatListChild
          key={chat.id}
          chatId={chat.id as number}
          user={
            chat?.secondUser || {
              id: 0,
              name: null,
              email: "",
              password: null,
              createdAt: new Date(),
              emailVerified: null,
              chatIds: [],
            }
          }
        />
      ))}
    </>
  );
};

export default MyChatList;
