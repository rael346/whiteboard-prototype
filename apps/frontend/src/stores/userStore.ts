import { create } from "zustand";

export type User = {
  socketId: string;
  name: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
}));
