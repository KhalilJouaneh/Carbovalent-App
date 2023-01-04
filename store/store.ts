import create from 'zustand'
import {persist} from "zustand/middleware"

type Store = {
  bears: number,
  searchQuery: string,
  updateSearchQuery: (searchQuery: string) => void;
}

type Actions = {
  increasePopulation: () => void;
}

export const useStore = create<Store & Actions>()(
    (set) => ({
      bears: 4,
      increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
      searchQuery: "",
      updateSearchQuery: (searchQuery) => set({ searchQuery }),
    })
)

// export const useStore = create<Store & Actions>()(
//   persist(
//     (set) => ({
//       bears: 4,
//       increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
//       searchQuery: "China",
//     }),
//     {name: "global", getStorage: () =>
//       localStorage }
//   )
// )


