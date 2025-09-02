// store/useUserStore.ts
import { create } from "zustand";

interface UserState {
  userId: number | null;
  setUserId: (id: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  clearUser: () => set({ userId: null }),
}));
