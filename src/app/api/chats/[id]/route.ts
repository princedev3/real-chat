import { auth } from "@/auth";
import prisma from "@/prisma/Prismadb";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const session = await auth();
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
        userIds: {
          hasSome: [Number(session?.user?.id)],
        },
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.log(error);
    return new NextResponse("can not fetch single chat", { status: 500 });
  }
};
