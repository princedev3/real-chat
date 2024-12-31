import { auth } from "./auth";

export const currentUser = async () => {
  const session = await auth();
  console.log(session?.user);
  return session?.user;
};
