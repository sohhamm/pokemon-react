import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Filters {
  name: string
  types: string[]
  generation: string
  minStats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}

interface PokemonStore {
  filters: Filters
  setFilters: (filters: Partial<Filters>) => void
  clearFilters: () => void
  favorites: number[]
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
}

const initialFilters: Filters = {
  name: "",
  types: [],
  generation: "",
  minStats: {
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
  },
}

export const usePokemonStore = create<PokemonStore>()(
  persist(
    (set, get) => ({
      filters: initialFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      clearFilters: () => set({ filters: initialFilters }),
      favorites: [],
      addFavorite: (id) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== id),
        })),
    }),
    {
      name: "pokemon-store",
    },
  ),
)
