import create from 'zustand';

type State = {
  searchTerm: string;
  setSearchTerm: (name: string) => void;
};

export const useSearchStore = create<State>((set) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));
