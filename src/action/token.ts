"use server";
import prisma from "@/prisma/Prismadb";
import { v4 as uuid4 } from "uuid";
import { getUserByEmail } from "./user-action";

export const getExistingToken = async (email: string) => {
  try {
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        email: email,
      },
    });
    return existingToken;
  } catch (error) {
    return null;
  }
};
export const getExistingTokenByToken = async (token: string) => {
  try {
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        token,
      },
    });
    return existingToken;
  } catch (error) {
    return null;
  }
};
export const generateVerificationToken = async (email: string) => {
  const token = uuid4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 5);

  const checkExistingToken = await getExistingToken(email);

  if (checkExistingToken) {
    prisma.verificationToken.delete({
      where: {
        id: checkExistingToken.id,
      },
    });
  }

  await prisma.verificationToken.create({
    data: {
      email: email,
      token: token,
      expires: expires,
    },
  });

  return token;
};

export const newVerificationToken = async (token: string) => {
  const checkExistingToken = await getExistingTokenByToken(token);

  if (!checkExistingToken) {
    return { error: "Token not found" };
  }
  const hasExpired = new Date(checkExistingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token expired" };
  }

  const getUser = await getUserByEmail(checkExistingToken.email);
  if (!getUser) {
    return { error: "User not found" };
  }

  await prisma.user.update({
    where: {
      email: checkExistingToken.email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  prisma.verificationToken.delete({
    where: {
      id: checkExistingToken.id,
    },
  });

  return { success: "Email verified!" };
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
