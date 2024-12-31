import ChatArea from "@/components/chat-area";
import ListUser from "@/components/list-user";
import React from "react";
export const dynamic = "force-dynamic";
const page = async () => {
  return (
    <div className="grid content-start w-full max-w-5xl mx-auto p-5 shadow-xl rounded-md min-h-[80vh] ">
      <div className="grid md:grid-cols-[30%_70%]  gap-5 items-start h-full min-h-screen ">
        <ListUser />
        <ChatArea />
      </div>
    </div>
  );
};

export default page;
