import { pusherServer } from "@/lib/pusher";
import { useMutation } from "@tanstack/react-query";

interface UserQuery {
  queryKey: string;
  apiUrl: string;
}
export const useCreateMessage = async ({ apiUrl, queryKey }: UserQuery) => {
  const mutationMessageFn = async (messageData: {
    chatId: number;
    text: string;
    userId: number;
  }) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      console.log("Error creating message");
      return;
    }
    const res = await response.json();
    const { chatId, text, userId, createdAt, id } = res;
    if (!chatId || !text || !userId || !createdAt || !id) {
      throw new Error("Invalid response data");
    }
  };
  return useMutation({
    mutationKey: [queryKey],
    mutationFn: mutationMessageFn,
    retry: false,
  });
};
