import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User{
  username:string
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        updateUserProfile: (updatedUser) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updatedUser } : null,
          })),
      }),
      {
        name: 'user-storage', 
      }
    )
  )
);

export default useUserStore;
