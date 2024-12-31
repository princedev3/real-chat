"use server";
import prisma from "@/prisma/Prismadb";
import { getUserByEmail } from "./user-action";
import bcrypt from "bcryptjs";
import { generatePasswordResetToken, generateVerificationToken } from "./token";
import { sendVerificationEmail } from "@/lib/mail";
import * as z from "zod";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signOut } from "@/auth";

import { randomBytes } from "crypto";
import { sendIvitationEmail, sendPasswordResetEmail } from "./invitemail";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

const loginSchema = z.object({
  email: z.string().email({
    message: "Email is requred",
  }),
  password: z.string().min(5, {
    message: "password must be at least 5 characters.",
  }),
});

const resetSchema = z.object({
  email: z.string().email("Invalid email format").min(5).max(50),
});

const changePasswordSchema = z.object({
  password: z.string().min(5, {
    message: "password must be at least 5 characters.",
  }),
});

export const createChat = async (id: number) => {};

export async function createUser({
  name,
  email,
  password,
  token,
}: {
  name: string;
  email: string;
  password: string;
  token?: string;
}) {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "user already exists" };
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (token) {
      const newInviteUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });
      const invitation = await prisma.invitation.update({
        where: {
          token,
        },
        data: {
          accepted: true,
          recievedById: newInviteUser.id,
        },
      });

      await prisma.chat.create({
        data: {
          userIds: [invitation.createdById, newInviteUser.id],
          users: {
            connect: [{ id: invitation.createdById }, { id: newInviteUser.id }],
          },
        },
      });
      await prisma.invitation.delete({
        where: {
          token,
        },
      });
      const verificationToken = await generateVerificationToken(email);
      sendVerificationEmail(email, verificationToken);
      return { success: "user created check your email for verification" };
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    sendVerificationEmail(email, verificationToken);
    return { success: "user created check your email for verification" };
  } catch (error) {
    console.log(error);
    return { error: "can not create user" };
  }
}

export async function getSingleChat(chatId: number, userId: number) {
  try {
    const userChars = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIds: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        users: true,
      },
    });
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          set: [userId],
        },
      },
    });
    return userChars;
  } catch (error) {
    return { error: "can not get single chat" };
  }
}

export const createMessage = async (details: {
  chatId: number;
  userId: number;
  text: string;
}) => {
  const createdMessage = await prisma.message.create({
    data: {
      chatId: details.chatId,
      userId: details.userId,
      text: details.text,
    },
  });
  return createdMessage;
};

export const loginUser = async (values: z.infer<typeof loginSchema>) => {
  const validatedfields = loginSchema.safeParse(values);
  if (!validatedfields.success) {
    return { error: "Invalid field!" };
  }
  const { email, password } = validatedfields.data;
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "User not found!" };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(email, verificationToken);
      return { error: "check your email for verification!" };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: "Logged in Successfully !" };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credential!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut();
};

export async function createInvitation(userId: number, email: string) {
  try {
    if (!userId) {
      return;
    }
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const checkIfUserExists = await getUserByEmail(email);
    if (checkIfUserExists) {
      const invitation = await prisma.invitation.create({
        data: {
          recievedById: checkIfUserExists.id,
          token,
          createdById: userId,
          expiresAt,
        },
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
      });

      pusherServer.trigger("invite-channel", "update-invite", {
        ...invitation,
      });

      return { success: "Invitation sent successfully!" };
    }
    const invitation = await prisma.invitation.create({
      data: {
        token,
        createdById: userId,
        expiresAt,
      },
    });
    await sendIvitationEmail(email, token);
    return { success: "Invitation sent successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Invitation not  sent successfully!" };
  }
}
export const acceptInvitation = async (userId: number, token: string) => {
  try {
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        token,
        recievedById: userId,
      },
    });
    if (!existingInvitation) {
      return { error: "Invitation not found!" };
    }
    const createdUser = await prisma.user.findUnique({
      where: {
        id: existingInvitation.createdById,
      },
    });

    if (!createdUser) {
      return { error: "User not found!" };
    }

    await prisma.chat.create({
      data: {
        userIds: [
          existingInvitation.createdById,
          Number(existingInvitation.recievedById) as number,
        ],
        users: {
          connect: [
            { id: existingInvitation.createdById },
            { id: Number(existingInvitation.recievedById) as number },
          ],
        },
      },
    });

    await prisma.invitation.delete({
      where: {
        token,
      },
    });
    revalidatePath("/");
    return { success: "Invitation accepted successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
export const deleteInvitation = async (userId: number, token?: string) => {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: {
        recievedById: Number(userId),
        token,
      },
    });
    if (!invitation) {
      return { error: "Invitation not found!" };
    }
    await prisma.invitation.delete({
      where: {
        token,
      },
    });
    revalidatePath("/");
    return { success: "Invitation deleted successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
export const fetchInvitations = async (userId: number) => {
  try {
    const session = await auth();

    if (!userId) {
      return { error: "User not found" };
    }
    const invitations = await prisma.invitation.findMany({
      where: {
        recievedById: Number(session?.user?.id),
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return invitations;
  } catch (error) {
    return { error: "can not fetch invitations" };
  }
};

export async function verifyInvitation(token: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token: String(token) },
    });
    if (!invitation || invitation.expiresAt < new Date()) {
      return { error: "Invalid or expired invitation link" };
    }

    return { success: "Invitation verified successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Invalid token!" };
  }
}

export const reset = async (value: z.infer<typeof resetSchema>) => {
  try {
    const validatedField = resetSchema.safeParse(value);
    if (!validatedField.success) {
      return { error: "Invalid email" };
    }

    const { email } = validatedField.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "User not found!" };
    }

    const generatedToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(generatedToken.email, generatedToken.token);
    return { success: "Password reset link sent to your email!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};

export const enterNewPassword = async (
  values: z.infer<typeof changePasswordSchema>,
  token: string | null
) => {
  try {
    if (!token) {
      return { error: "Missing token!" };
    }
    const validatedField = changePasswordSchema.safeParse(values);
    if (!validatedField.success) {
      return { error: "Invalid password" };
    }

    const { password } = validatedField.data;
    const existingPasswordResetToken =
      await prisma.passwordResetToken.findUnique({
        where: { token },
      });
    if (!existingPasswordResetToken) {
      return { error: "Invalid  token!" };
    }
    const isExpired = new Date(existingPasswordResetToken.expires) < new Date();
    if (isExpired) {
      return { error: "Token expired!" };
    }
    const existingUser = await getUserByEmail(existingPasswordResetToken.email);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: existingPasswordResetToken.id,
      },
    });

    return { success: "Password changed successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
