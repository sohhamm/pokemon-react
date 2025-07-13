import {Suspense} from 'react'
import {LoadingSpinner} from '@/components/ui/loading-spinner'
import {PokemonInfinitePageClient} from '@/components/pokemon/pokemon-infinite-page-client'

export const revalidate = 86400 // Revalidate every 24 hours

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='relative'>
            <h1 className='text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4'>
              Pokédex
            </h1>
          </div>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Discover and explore Pokémon from all generations with our comprehensive, interactive
            database
          </p>
        </div>

        {/* Pokemon Content */}
        <Suspense fallback={<LoadingSpinner size='lg' message='Loading Pokemon...' />}>
          <PokemonInfinitePageClient />
        </Suspense>
      </div>
    </div>
  )
}
