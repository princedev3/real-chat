import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma/Prismadb";
import authConfig from "./auth.config";
import { getUserById } from "./action/user-action";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;
      const userExists = await getUserById(Number(user.id));
      if (!userExists?.emailVerified) return false;
      if (!userExists) return false;
      const expiration = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
      user.customExpiration = expiration;
      return true;
    },
    async jwt({ user, token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(Number(token.sub));

      if (!existingUser) return token;

      if (user?.customExpiration) {
        token.expiration = user.customExpiration;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }

      if (token && session.user) {
        session.user.customExpiration = token?.expiration as number;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
