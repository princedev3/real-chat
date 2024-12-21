import prisma from "@/prisma/Prismadb";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const messages = await prisma.message.findMany({
      where: {
        chatId: Number(id),
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.log(error);
    return new NextResponse("can not get messages", { status: 500 });
  }
};
