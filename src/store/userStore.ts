import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  profile: string | null;
  completedModules: string[];
  screeningAnswers: Record<string, string>;
  setProfile: (profile: string | null) => void;
  addCompletedModule: (moduleId: string) => void;
  setScreeningAnswers: (answers: Record<string, string>) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      completedModules: [],
      screeningAnswers: {},
      setProfile: (profile) => set({ profile }),
      addCompletedModule: (moduleId) =>
        set((state) => ({
          completedModules: [...state.completedModules, moduleId],
        })),
      setScreeningAnswers: (answers) => set({ screeningAnswers: answers }),
      reset: () =>
        set({
          profile: null,
          completedModules: [],
          screeningAnswers: {},
        }),
    }),
    {
      name: 'user-storage',
    }
  )
); 