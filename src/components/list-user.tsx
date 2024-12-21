import React from "react";
import AvailableUser from "./available-user";
import MyChatList from "./my-chat-list";

const ListUser = () => {
  return (
    <div className="grid gap-y-8 ">
      <AvailableUser />
      <div className="grid gap-y-2">
        <span className="text-gray-900 text-xl"> Friends List</span>
        <MyChatList />
      </div>
    </div>
  );
};

export default ListUser;
