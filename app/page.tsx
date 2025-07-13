"use client"

import { useQuery } from "@tanstack/react-query"
import { usePokemonStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PokemonFilters } from "@/components/pokemon/pokemon-filters"
import { PokemonGrid } from "@/components/pokemon/pokemon-grid"
import { AppNavigation } from "@/components/navigation/app-navigation"

interface Pokemon {
  id: number
  name: string
  types: Array<{ type: { name: string } }>
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  height: number
  weight: number
}

const GENERATIONS = [
  { value: "1", label: "Gen I (1-151)", range: [1, 151] },
  { value: "2", label: "Gen II (152-251)", range: [152, 251] },
  { value: "3", label: "Gen III (252-386)", range: [252, 386] },
  { value: "4", label: "Gen IV (387-493)", range: [387, 493] },
  { value: "5", label: "Gen V (494-649)", range: [494, 649] },
]

async function fetchPokemonList(limit = 151) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
  const data = await response.json()

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: any, index: number) => {
      const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`)
      return detailResponse.json()
    }),
  )

  return pokemonDetails
}

export default function HomePage() {
  const { filters, setFilters, clearFilters } = usePokemonStore()

  const { data: pokemon = [], isLoading } = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: () => fetchPokemonList(151),
    staleTime: 1000 * 60 * 5,
  })

  const filteredPokemon = pokemon.filter((p: Pokemon) => {
    // Name filter
    if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false
    }

    // Type filter
    if (filters.types.length > 0) {
      const pokemonTypes = p.types.map((t) => t.type.name)
      if (!filters.types.some((type) => pokemonTypes.includes(type))) {
        return false
      }
    }

    // Generation filter
    if (filters.generation) {
      const gen = GENERATIONS.find((g) => g.value === filters.generation)
      if (gen && (p.id < gen.range[0] || p.id > gen.range[1])) {
        return false
      }
    }

    return true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" message="Loading Pokemon..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Pokédex
            </h1>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover and explore Pokémon from all generations with our comprehensive, interactive database
          </p>
        </div>

        {/* Navigation */}
        <AppNavigation />

        {/* Filters */}
        <div className="mb-8">
          <PokemonFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            resultCount={filteredPokemon.length}
            totalCount={pokemon.length}
          />
        </div>

        {/* Pokemon Grid */}
        <PokemonGrid
          pokemon={filteredPokemon}
          emptyMessage="No Pokémon found matching your filters."
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  )
}
