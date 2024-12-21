import React from "react";
import UserProfile from "./user-profile";
import FetchInvite from "./fetch-invite";

const Header = () => {
  return (
    <div className="grid w-full max-w-5xl mx-auto p-5 shadow-md bg-gray-50 grid-flow-col">
      <div className="">
        <h1 className="text-2xl font-bold ">Real-time Chat</h1>
        <FetchInvite />
      </div>
      <div className=" justify-self-end ">
        {" "}
        <UserProfile />
      </div>
    </div>
  );
};

export default Header;
