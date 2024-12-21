import { create } from "zustand";

type ChatType = {
  id: number;
  name: string;
};

interface ChatState {
  open: boolean;
  setOpen: (open: boolean) => void;
  chats: ChatType | null;
  setActiveChatId: (chat: ChatType) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  chats: null,
  setActiveChatId: (chat) => set({ chats: chat }),
}));
