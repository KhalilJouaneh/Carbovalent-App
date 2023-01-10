import create from 'zustand'
import {persist} from "zustand/middleware"

type Store = {
  pageNumber: number;
  searchQuery: string;
  updateSearchQuery: (searchQuery: string) => void;
  userInitialized : boolean;
  filterToggle: boolean;
  cardTableToggle: boolean;
  resetPageNumber: (pageNummber: number) => void;
} 

type Actions = {
  incrementPage: () => void;
  decrementPage: () => void;
  setCardTableToggle: () => void; 
  setFilterToggle: () => void;
}

export const useStore = create<Store & Actions>()(
    (set) => ({
      pageNumber: 1,
      incrementPage: () => set((state: any) => ({ pageNumber: state.pageNumber + 1 })),
      decrementPage: () => set((state: any) => ({ pageNumber: state.pageNumber - 1 })),
      searchQuery: "",
      updateSearchQuery: (searchQuery) => set({ searchQuery }),
      userInitialized: false,
      filterToggle: true,
      cardTableToggle: true,
      setCardTableToggle: () => set((state:any) => ({cardTableToggle: !state.cardTableToggle})),
      setFilterToggle: () => set((state:any) => ({filterToggle: !state.filterToggle})),
      resetPageNumber: () => set((state: any) => ({ pageNumber: state.pageNumber - state.pageNumber + 1 })),
    })
)
