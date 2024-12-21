"use client";
import React from "react";
import { Button } from "./ui/button";
import { createChat } from "../action/actions";

const AvailableSingleUser = ({ id, name }: { id: number; name: string }) => {
  const handleAddChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdChat = await createChat(id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <form onSubmit={handleAddChat}>
        <Button
          type="submit"
          variant={"outline"}
          className="cursor-pointer bg-transparent "
          key={id}
        >
          {name} hello
        </Button>
      </form>
    </div>
  );
};

export default AvailableSingleUser;
