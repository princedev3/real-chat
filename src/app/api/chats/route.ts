import { pusherServer } from "@/lib/pusher";
import prisma from "@/prisma/Prismadb";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const message = await prisma.message.create({
      data: body,
    });
    pusherServer.trigger("chat-channel", "update-chat", {
      ...message,
    });
    return NextResponse.json(message);
  } catch (error) {
    console.log(error);
    return new NextResponse("can create message", { status: 500 });
  }
};
