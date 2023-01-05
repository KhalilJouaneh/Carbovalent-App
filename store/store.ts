import create from 'zustand'
import {persist} from "zustand/middleware"

type Store = {
  pageNumber: number,
  searchQuery: string,
  updateSearchQuery: (searchQuery: string) => void;
}

type Actions = {
  incrementPage: () => void;
  decrementPage: () => void;
}

export const useStore = create<Store & Actions>()(
    (set) => ({
      pageNumber: 1,
      incrementPage: () => set((state: any) => ({ pageNumber: state.pageNumber + 1 })),
      decrementPage: () => set((state: any) => ({ pageNumber: state.pageNumber - 1 })),
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


