import { User } from '@/models/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  loginDetails: User | null;
  setLoginDetails: (val: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      loginDetails: null,
      setLoginDetails: (value: User) => set({ loginDetails: value }),
    }),
    { name: 'user-store', storage: createJSONStorage(() => sessionStorage) }
  )
);
