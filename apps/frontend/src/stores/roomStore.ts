import { create } from "zustand";
import { User } from "@/stores/userStore";

type RoomState = {
  admin: User | undefined;
  members: User[];
  setAdmin: (admin: User | undefined) => void;
  setMembers: (members: User[]) => void;
};

export const useRoomStore = create<RoomState>(set => ({
  admin: undefined,
  members: [],
  setAdmin: admin => set({ admin }),
  setMembers: members => set({ members }),
}));
