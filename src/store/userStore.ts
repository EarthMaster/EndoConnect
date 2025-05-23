import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  profile: string | null; // This stores the risk level (LOW, MODERATE, HIGH)
  completedModules: string[];
  screeningAnswers: Record<string, any>;
  setProfile: (profile: string | null) => void;
  addCompletedModule: (moduleId: string) => void;
  setScreeningAnswers: (answers: Record<string, any>) => void;
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