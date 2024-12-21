"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useSessionStore } from "@/store/session-provider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronDown } from "lucide-react";
import { logout } from "@/action/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserProfile = () => {
  const user = useSessionStore((state) => state.session?.user);

  const nameAbrev = user?.name?.split("").splice(0, 2).join("");
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };
  if (!user) {
    return (
      <div className="relative overflow-hidden group">
        <Link href={"/auth/login"}>
          <Button className="relative bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-pointer overflow-hidden">
            Login
            <span className="absolute top-0 left-[-150%] h-full w-full bg-white opacity-20 transform skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[150%]"></span>
          </Button>
        </Link>
      </div>
    );
  }
  if (user) {
    return (
      <div className=" ">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none  ">
            <Button asChild variant={"outline"} className="rounded-full h-12">
              <span className="flex space-x-2">
                <Avatar className="size-9 ">
                  <AvatarFallback className="uppercase relative group font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500">
                    {" "}
                    {nameAbrev}
                    <span className="absolute top-0 left-[-150%] h-full w-full bg-white opacity-20 transform skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-[150%]"></span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex  items-center space-x-2">
                  <div className="xl:flex flex-col justify-end hidden">
                    <span className="line-clamp-1 text-xs text-gray-600">
                      {user?.email}
                    </span>
                  </div>
                  <div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
};

export default UserProfile;
