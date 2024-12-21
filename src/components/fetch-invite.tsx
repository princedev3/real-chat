"use client";
import {
  acceptInvitation,
  deleteInvitation,
  fetchInvitations,
} from "@/action/actions";
import { pusherClient } from "@/lib/pusher";
import { useSessionStore } from "@/store/session-provider";
import { Invitation } from "@prisma/client";
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type InviteListType = {
  id: number;
  token: string;
  createdById: number;
  recievedById: number | null;
  createdAt: Date;
  expiresAt: Date;
  accepted: boolean;
  createdBy: {
    name: string;
  };
};
const FetchInvite = () => {
  const [inviteList, setInviteList] = useState<InviteListType[]>([]);
  const session = useSessionStore((state) => state.session);

  useEffect(() => {
    const fetchInvite = async () => {
      if (session?.user?.id) {
        const invite = await fetchInvitations(Number(session?.user?.id));
        setInviteList(invite as InviteListType[]);
      }
    };
    fetchInvite();
    const channel = pusherClient.subscribe("invite-channel");
    channel.bind("update-invite", (message: any) => {
      setInviteList((prev) => [...prev, message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session]);

  const handleDelete = async (userId: number | null, token?: string) => {
    try {
      await deleteInvitation(userId as number, token as string);
      toast.success("Invitation deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = async (id: number, token: string) => {
    try {
      await acceptInvitation(id, token);
      toast.success("Invitation accepted successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {inviteList?.map((item) => (
        <div key={item.id} className="flex items-center  gap-2">
          <span className="text-gray-500 capitalize">
            {item?.createdBy?.name}{" "}
          </span>
          <span
            onClick={() => handleDelete(item.recievedById, item.token)}
            className="bg-red-400 p-1 rounded-full cursor-pointer flex items-center justify-center text-white"
          >
            <ThumbsDown className="text-xs text-white size-3 " />
          </span>
          <span
            onClick={() =>
              handleAccept(Number(item.recievedById) as number, item.token)
            }
            className="bg-green-500 p-1 rounded-full flex cursor-pointer items-center justify-center text-white"
          >
            <ThumbsUp className="text-xs text-white size-3 " />
          </span>
        </div>
      ))}
    </div>
  );
};

export default FetchInvite;
