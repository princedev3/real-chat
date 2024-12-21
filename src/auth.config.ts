import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma/Prismadb";
import bcrypt from "bcrypt";

export default {
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          ...user,
          id: user.id.toString(),
        };
      },
    }),
  ],
};
