'use client'

import {useMemo} from 'react'
import {usePokemonStore} from '@/lib/store'
import {useInfiniteSimplePokemonList} from '@/lib/api/hooks'
import {PokemonFilters} from '@/components/pokemon/pokemon-filters'
import {PokemonInfiniteGrid} from '@/components/pokemon/pokemon-infinite-grid'

const GENERATIONS = [
  {value: '1', label: 'Gen I (1-151)', range: [1, 151]},
  {value: '2', label: 'Gen II (152-251)', range: [152, 251]},
  {value: '3', label: 'Gen III (252-386)', range: [252, 386]},
  {value: '4', label: 'Gen IV (387-493)', range: [387, 493]},
  {value: '5', label: 'Gen V (494-649)', range: [494, 649]},
]

export function PokemonInfinitePageClient() {
  const {filters, setFilters, clearFilters} = usePokemonStore()

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error} =
    useInfiniteSimplePokemonList(20)

  const allPokemon = useMemo(() => {
    return data?.pages.flatMap(page => page) || []
  }, [data])

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter(p => {
      // Name filter
      if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }

      // Type filter
      if (filters.types.length > 0) {
        if (!filters.types.some(type => p.types.includes(type))) {
          return false
        }
      }

      // Generation filter
      if (filters.generation) {
        const gen = GENERATIONS.find(g => g.value === filters.generation)
        if (gen && (p.id < gen.range[0] || p.id > gen.range[1])) {
          return false
        }
      }

      return true
    })
  }, [allPokemon, filters])

  if (error) {
    return (
      <div className='text-center py-16'>
        <div className='max-w-md mx-auto'>
          <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center'>
            <div className='w-12 h-12 bg-red-400 rounded-full opacity-50'></div>
          </div>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>Error Loading Pokemon</h3>
          <p className='text-gray-500 mb-6'>
            There was an error loading the Pokemon data. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Filters */}
      <div className='mb-8'>
        <PokemonFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          resultCount={filteredPokemon.length}
          totalCount={allPokemon.length}
        />
      </div>

      {/* Pokemon Grid */}
      <PokemonInfiniteGrid
        pokemon={filteredPokemon}
        loading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        emptyMessage='No Pokémon found matching your filters.'
        onClearFilters={clearFilters}
      />
    </>
  )
}
