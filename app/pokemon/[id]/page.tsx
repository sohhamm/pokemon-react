'use client'

import {use} from 'react'
import {Button} from '@/components/ui/button'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Heart, Share2, Crown, Zap, Star} from 'lucide-react'
import {PageHeader} from '@/components/ui/page-header'
import {LoadingSpinner} from '@/components/ui/loading-spinner'
import {PokemonImageGallery} from '@/components/pokemon/pokemon-image-gallery'
import {PokemonBasicInfo} from '@/components/pokemon/pokemon-basic-info'
import {PokemonDetailedStats} from '@/components/pokemon/pokemon-detailed-stats'
import {PokemonAbout} from '@/components/pokemon/pokemon-about'
import {EvolutionChain} from '@/components/evolution-chain'
import {usePokemon, usePokemonSpecies} from '@/lib/api/hooks'

function getTypeGradient(types: string[]) {
  const typeColors: Record<string, string> = {
    normal: 'from-gray-400 to-gray-500',
    fire: 'from-red-500 to-orange-600',
    water: 'from-blue-500 to-cyan-600',
    electric: 'from-yellow-400 to-yellow-500',
    grass: 'from-green-500 to-emerald-600',
    ice: 'from-blue-200 to-cyan-400',
    fighting: 'from-red-700 to-red-800',
    poison: 'from-purple-500 to-purple-700',
    ground: 'from-yellow-600 to-amber-700',
    flying: 'from-indigo-400 to-sky-500',
    psychic: 'from-pink-500 to-purple-600',
    bug: 'from-green-400 to-lime-500',
    rock: 'from-yellow-800 to-amber-900',
    ghost: 'from-purple-700 to-indigo-800',
    dragon: 'from-indigo-700 to-purple-800',
    dark: 'from-gray-800 to-gray-900',
    steel: 'from-gray-500 to-slate-600',
    fairy: 'from-pink-300 to-rose-500',
  }

  const primaryType = types[0]
  return typeColors[primaryType] || 'from-gray-400 to-gray-500'
}

function getPowerLevel(stats: Array<{base_stat: number; stat: {name: string}}>) {
  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  if (totalStats > 500) return 'legendary'
  if (totalStats > 400) return 'strong'
  return 'normal'
}

export default function PokemonDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params)

  const {data: pokemon, isLoading} = usePokemon(parseInt(id))
  const {data: species} = usePokemonSpecies(parseInt(id))

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <LoadingSpinner size='lg' message='Loading Pokemon details...' />
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center py-16'>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Pokemon Not Found</h2>
            <p className='text-gray-600'>The Pokemon you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const types = pokemon.types.map(t => t.type.name)
  const gradient = getTypeGradient(types)
  const powerLevel = getPowerLevel(pokemon.stats)
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  const flavorText =
    species?.flavor_text_entries
      .find(entry => entry.language.name === 'en')
      ?.flavor_text.replace(/\f/g, ' ') || 'No description available.'

  const headerActions = (
    <>
      <Button
        variant='outline'
        size='sm'
        className='shadow-lg hover:shadow-xl transition-all bg-white/80'
      >
        <Heart className='w-4 h-4 text-red-500' />
      </Button>
      <Button
        variant='outline'
        size='sm'
        className='shadow-lg hover:shadow-xl transition-all bg-white/80'
      >
        <Share2 className='w-4 h-4 text-blue-500' />
      </Button>
    </>
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Hero Section */}
        <div
          className={`relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-r ${gradient} shadow-2xl`}
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-20'>
            <div className='absolute top-8 right-8 w-32 h-32 rounded-full border-4 border-white/30'></div>
            <div className='absolute bottom-8 left-8 w-20 h-20 rounded-full bg-white/30'></div>
            <div className='absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-white/20'></div>
          </div>

          <div className='relative p-8 text-white'>
            <div className='flex items-start justify-between mb-6'>
              <PageHeader
                title={pokemon.name}
                description={`#${pokemon.id.toString().padStart(3, '0')}`}
                backLink='/'
                backText='Back'
                actions={headerActions}
              />
            </div>

            <div className='grid lg:grid-cols-2 gap-8 items-center'>
              {/* Pokemon Image */}
              <div className='text-center'>
                <div className='relative w-64 h-64 mx-auto mb-6'>
                  <div className='absolute inset-0 bg-white/20 rounded-full blur-3xl'></div>
                  <img
                    src={
                      pokemon.sprites.other['official-artwork'].front_default || '/placeholder.svg'
                    }
                    alt={pokemon.name}
                    className='w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-110 transition-transform duration-300'
                  />
                </div>

                {/* Power Level Badge */}
                <div className='flex justify-center gap-3'>
                  {species?.is_legendary && (
                    <div className='flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-lg'>
                      <Crown className='w-5 h-5' />
                      <span className='font-bold'>Legendary</span>
                    </div>
                  )}
                  {species?.is_mythical && (
                    <div className='flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-500 px-4 py-2 rounded-full shadow-lg'>
                      <Star className='w-5 h-5' />
                      <span className='font-bold'>Mythical</span>
                    </div>
                  )}
                  {powerLevel === 'strong' && !species?.is_legendary && !species?.is_mythical && (
                    <div className='flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-500 px-4 py-2 rounded-full shadow-lg'>
                      <Zap className='w-5 h-5' />
                      <span className='font-bold'>Strong</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className='space-y-6'>
                <div>
                  <h2 className='text-3xl font-bold capitalize mb-2'>{pokemon.name}</h2>
                  <p className='text-xl opacity-90 mb-4'>{flavorText}</p>
                </div>

                {/* Type badges */}
                <div className='flex gap-3'>
                  {pokemon.types.map(type => (
                    <div
                      key={type.type.name}
                      className='bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'
                    >
                      <span className='font-semibold capitalize'>{type.type.name}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Stats Grid */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30'>
                    <div className='text-2xl font-bold'>{(pokemon.height / 10).toFixed(1)}m</div>
                    <div className='text-sm opacity-90'>Height</div>
                  </div>
                  <div className='bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30'>
                    <div className='text-2xl font-bold'>{(pokemon.weight / 10).toFixed(1)}kg</div>
                    <div className='text-sm opacity-90'>Weight</div>
                  </div>
                  <div className='bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30'>
                    <div className='text-2xl font-bold'>{totalStats}</div>
                    <div className='text-sm opacity-90'>Total Stats</div>
                  </div>
                  <div className='bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30'>
                    <div className='text-2xl font-bold'>{species?.capture_rate || 'Unknown'}</div>
                    <div className='text-sm opacity-90'>Catch Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue='stats' className='w-full'>
          <div className='flex justify-center mb-8'>
            <TabsList className='grid w-full max-w-md grid-cols-4 bg-white shadow-lg rounded-xl p-1'>
              <TabsTrigger
                value='stats'
                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all'
              >
                Stats
              </TabsTrigger>
              <TabsTrigger
                value='about'
                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all'
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value='gallery'
                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all'
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value='evolution'
                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all'
              >
                Evolution
              </TabsTrigger>
            </TabsList>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Left Column - Basic Info (Always Visible) */}
            <div className='lg:col-span-1'>
              <PokemonBasicInfo pokemon={pokemon} species={species} />
            </div>

            {/* Right Column - Tab Content */}
            <div className='lg:col-span-2'>
              <TabsContent value='stats' className='mt-0'>
                <PokemonDetailedStats pokemon={pokemon} />
              </TabsContent>

              <TabsContent value='about' className='mt-0'>
                <PokemonAbout flavorText={flavorText} species={species} />
              </TabsContent>

              <TabsContent value='gallery' className='mt-0'>
                <PokemonImageGallery pokemon={pokemon} />
              </TabsContent>

              <TabsContent value='evolution' className='mt-0'>
                <div className='bg-white rounded-xl border-0 shadow-xl p-6'>
                  <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradient}`}></div>
                    Evolution Chain
                  </h3>
                  {species?.evolution_chain ? (
                    <EvolutionChain evolutionChainUrl={species.evolution_chain.url} />
                  ) : (
                    <p className='text-gray-500 text-center py-8'>Evolution data not available</p>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
