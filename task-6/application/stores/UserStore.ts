import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  nickname: string;
  setNickname: (nickname: string) => void;
  logout: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      nickname: "",
      setNickname: (nickname: string) => set({ nickname }),
      logout: () => set({ nickname: "" }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
