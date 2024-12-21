import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  expiration?: number;
};
declare module "next-auth" {
  interface Session {
    user?: ExtendedUser;
  }
  interface User {
    customExpiration?: number;
  }
}
