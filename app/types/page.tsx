'use client'

import {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {ArrowLeft, Zap, Shield, Sword, Target} from 'lucide-react'
import Link from 'next/link'

const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

// Type effectiveness chart (attacking type vs defending type)
const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: {rock: 0.5, ghost: 0, steel: 0.5},
  fire: {fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2},
  water: {fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5},
  electric: {water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5},
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5},
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2},
  ground: {fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2},
  flying: {electric: 0.5, grass: 2, ice: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5},
  psychic: {fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5},
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5},
  ghost: {normal: 0, psychic: 2, ghost: 2, dark: 0.5},
  dragon: {dragon: 2, steel: 0.5, fairy: 0},
  dark: {fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5},
  steel: {fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2},
  fairy: {fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5},
}

function getEffectiveness(attackingType: string, defendingType: string): number {
  return TYPE_EFFECTIVENESS[attackingType]?.[defendingType] ?? 1
}

function getEffectivenessColor(effectiveness: number): string {
  if (effectiveness === 0) return 'bg-gradient-to-r from-gray-600 to-gray-700'
  if (effectiveness === 0.5) return 'bg-gradient-to-r from-red-500 to-red-600'
  if (effectiveness === 2) return 'bg-gradient-to-r from-green-500 to-green-600'
  return 'bg-gradient-to-r from-blue-400 to-blue-500'
}

function getEffectivenessText(effectiveness: number): string {
  if (effectiveness === 0) return '0×'
  if (effectiveness === 0.5) return '½×'
  if (effectiveness === 2) return '2×'
  return '1×'
}

function getEffectivenessIcon(effectiveness: number) {
  if (effectiveness === 0) return '🚫'
  if (effectiveness === 0.5) return '🔻'
  if (effectiveness === 2) return '🔥'
  return '⚡'
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
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
  return colors[type] || 'from-gray-400 to-gray-500'
}

export default function TypesPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [highlightMode, setHighlightMode] = useState<'attacking' | 'defending'>('attacking')

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link href='/'>
            <Button
              variant='outline'
              size='sm'
              className='shadow-lg hover:shadow-xl transition-all bg-transparent'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Pokedex
            </Button>
          </Link>
          <div className='flex-1'>
            <div className='relative'>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                Type Effectiveness Matrix
              </h1>
            </div>
            <p className='text-lg text-gray-600'>
              Master Pokemon battles with our interactive type matchup guide
            </p>
          </div>
        </div>

        {/* Type Selector */}
        <Card className='mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='w-5 h-5 text-purple-600' />
              Select a Type to Analyze
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-3 mb-6'>
              <Button
                variant={selectedType === null ? 'default' : 'outline'}
                onClick={() => setSelectedType(null)}
                className={`${
                  selectedType === null
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'hover:shadow-md'
                } transition-all`}
              >
                Show All Types
              </Button>
              {POKEMON_TYPES.map(type => {
                const gradient = getTypeColor(type)
                return (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    onClick={() => setSelectedType(type)}
                    className={`${
                      selectedType === type
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105`
                        : `hover:bg-gradient-to-r hover:${gradient} hover:text-white hover:shadow-md`
                    } transition-all capitalize font-medium`}
                  >
                    {type}
                  </Button>
                )
              })}
            </div>

            {selectedType && (
              <div className='flex gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl'>
                <Button
                  variant={highlightMode === 'attacking' ? 'default' : 'outline'}
                  onClick={() => setHighlightMode('attacking')}
                  className={`${
                    highlightMode === 'attacking'
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                      : 'hover:bg-red-50'
                  } transition-all`}
                >
                  <Sword className='w-4 h-4 mr-2' />
                  {selectedType} Attacking
                </Button>
                <Button
                  variant={highlightMode === 'defending' ? 'default' : 'outline'}
                  onClick={() => setHighlightMode('defending')}
                  className={`${
                    highlightMode === 'defending'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                      : 'hover:bg-blue-50'
                  } transition-all`}
                >
                  <Shield className='w-4 h-4 mr-2' />
                  {selectedType} Defending
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className='mb-8 border-0 shadow-xl bg-gradient-to-r from-white to-gray-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Zap className='w-5 h-5 text-yellow-600' />
              Effectiveness Legend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl'>
                <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg'>
                  2×
                </div>
                <div>
                  <p className='font-semibold text-green-800'>Super Effective</p>
                  <p className='text-xs text-green-600'>Double damage</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg'>
                  1×
                </div>
                <div>
                  <p className='font-semibold text-blue-800'>Normal Damage</p>
                  <p className='text-xs text-blue-600'>Standard effectiveness</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl'>
                <div className='w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg'>
                  ½×
                </div>
                <div>
                  <p className='font-semibold text-red-800'>Not Very Effective</p>
                  <p className='text-xs text-red-600'>Half damage</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl'>
                <div className='w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg'>
                  0×
                </div>
                <div>
                  <p className='font-semibold text-gray-800'>No Effect</p>
                  <p className='text-xs text-gray-600'>Immune to damage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type Effectiveness Matrix */}
        <Card className='mb-8 border-0 shadow-2xl bg-white overflow-hidden'>
          <CardHeader className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white'>
            <CardTitle className='text-xl'>
              Interactive Type Chart
              {selectedType && (
                <span className='text-base font-normal ml-3 opacity-90'>
                  - {highlightMode === 'attacking' ? '🗡️ Attacking with' : '🛡️ Defending against'}{' '}
                  <span className='capitalize font-semibold'>{selectedType}</span>
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <div className='min-w-max'>
                {/* Header row */}
                <div className='flex bg-gradient-to-r from-gray-100 to-gray-200'>
                  <div className='w-24 h-16 flex items-center justify-center font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white'>
                    ATK \ DEF
                  </div>
                  {POKEMON_TYPES.map(defendingType => {
                    const gradient = getTypeColor(defendingType)
                    return (
                      <div
                        key={defendingType}
                        className={`w-16 h-16 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r ${gradient} ${
                          selectedType === defendingType
                            ? 'ring-4 ring-yellow-400/75 z-10 relative'
                            : ''
                        } shadow-lg hover:shadow-xl transition-all group cursor-pointer`}
                        title={defendingType}
                      >
                        <div className='text-center group-hover:scale-110 transition-transform'>
                          <div>{defendingType.slice(0, 3).toUpperCase()}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Matrix rows */}
                {POKEMON_TYPES.map(attackingType => {
                  const attackingGradient = getTypeColor(attackingType)
                  return (
                    <div key={attackingType} className='flex hover:bg-gray-50 transition-colors'>
                      <div
                        className={`w-24 h-16 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r ${attackingGradient} ${
                          selectedType === attackingType
                            ? 'ring-4 ring-yellow-400/75 z-10 relative'
                            : ''
                        } shadow-lg hover:shadow-xl transition-all group cursor-pointer`}
                        title={attackingType}
                      >
                        <div className='text-center group-hover:scale-110 transition-transform'>
                          <div>{attackingType.toUpperCase()}</div>
                        </div>
                      </div>
                      {POKEMON_TYPES.map(defendingType => {
                        const effectiveness = getEffectiveness(attackingType, defendingType)
                        const isHighlighted =
                          selectedType &&
                          ((highlightMode === 'attacking' && attackingType === selectedType) ||
                            (highlightMode === 'defending' && defendingType === selectedType))

                        return (
                          <div
                            key={`${attackingType}-${defendingType}`}
                            className={`w-16 h-16 flex flex-col items-center justify-center text-xs font-bold border border-gray-200 ${getEffectivenessColor(
                              effectiveness,
                            )} ${
                              isHighlighted
                                ? 'ring-4 ring-yellow-400/75 z-10 relative scale-110'
                                : 'hover:scale-105'
                            } text-white transition-all cursor-pointer group shadow-sm hover:shadow-lg`}
                            title={`${attackingType} vs ${defendingType}: ${getEffectivenessText(
                              effectiveness,
                            )}`}
                          >
                            <div className='text-lg group-hover:scale-110 transition-transform'>
                              {getEffectivenessIcon(effectiveness)}
                            </div>
                            <div className='font-bold'>{getEffectivenessText(effectiveness)}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type Analysis */}
        {selectedType && (
          <div className='grid md:grid-cols-2 gap-8'>
            <Card className='border-0 shadow-xl bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-red-500 to-orange-600 text-white'>
                <CardTitle className='flex items-center gap-2 capitalize'>
                  <Sword className='w-5 h-5' />
                  {selectedType} - Offensive Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                <div>
                  <h4 className='font-bold text-green-700 mb-3 flex items-center gap-2'>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                    Super Effective Against:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POKEMON_TYPES.filter(type => getEffectiveness(selectedType, type) === 2).map(
                      type => {
                        const gradient = getTypeColor(type)
                        return (
                          <Badge
                            key={type}
                            className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}
                          >
                            {type}
                          </Badge>
                        )
                      },
                    )}
                    {POKEMON_TYPES.filter(type => getEffectiveness(selectedType, type) === 2)
                      .length === 0 && <span className='text-gray-500 italic'>None</span>}
                  </div>
                </div>
                <div>
                  <h4 className='font-bold text-red-700 mb-3 flex items-center gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    Not Very Effective Against:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POKEMON_TYPES.filter(type => getEffectiveness(selectedType, type) === 0.5).map(
                      type => {
                        const gradient = getTypeColor(type)
                        return (
                          <Badge
                            key={type}
                            className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer opacity-75`}
                          >
                            {type}
                          </Badge>
                        )
                      },
                    )}
                    {POKEMON_TYPES.filter(type => getEffectiveness(selectedType, type) === 0.5)
                      .length === 0 && <span className='text-gray-500 italic'>None</span>}
                  </div>
                </div>
                <div>
                  <h4 className='font-bold text-gray-700 mb-3 flex items-center gap-2'>
                    <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                    No Effect Against:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POKEMON_TYPES.filter(type => getEffectiveness(selectedType, type) === 0).map(
                      type => {
                        const gradient = getTypeColor(type)
                        return (
                          <Badge
                            key={type}
                            className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer opacity-50`}
                          >
                            {type}
                          </Badge>
                        )
                      },
                    )}
                    {POKEMON_TYPES.filter(type => getEffectiveness(selectedType, type) === 0)
                      .length === 0 && <span className='text-gray-500 italic'>None</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-blue-500 to-cyan-600 text-white'>
                <CardTitle className='flex items-center gap-2 capitalize'>
                  <Shield className='w-5 h-5' />
                  {selectedType} - Defensive Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 space-y-6'>
                <div>
                  <h4 className='font-bold text-red-700 mb-3 flex items-center gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    Weak To:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POKEMON_TYPES.filter(type => getEffectiveness(type, selectedType) === 2).map(
                      type => {
                        const gradient = getTypeColor(type)
                        return (
                          <Badge
                            key={type}
                            className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer ring-2 ring-red-300`}
                          >
                            {type}
                          </Badge>
                        )
                      },
                    )}
                    {POKEMON_TYPES.filter(type => getEffectiveness(type, selectedType) === 2)
                      .length === 0 && <span className='text-gray-500 italic'>None</span>}
                  </div>
                </div>
                <div>
                  <h4 className='font-bold text-green-700 mb-3 flex items-center gap-2'>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                    Resists:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POKEMON_TYPES.filter(type => getEffectiveness(type, selectedType) === 0.5).map(
                      type => {
                        const gradient = getTypeColor(type)
                        return (
                          <Badge
                            key={type}
                            className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer ring-2 ring-green-300`}
                          >
                            {type}
                          </Badge>
                        )
                      },
                    )}
                    {POKEMON_TYPES.filter(type => getEffectiveness(type, selectedType) === 0.5)
                      .length === 0 && <span className='text-gray-500 italic'>None</span>}
                  </div>
                </div>
                <div>
                  <h4 className='font-bold text-gray-700 mb-3 flex items-center gap-2'>
                    <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                    Immune To:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POKEMON_TYPES.filter(type => getEffectiveness(type, selectedType) === 0).map(
                      type => {
                        const gradient = getTypeColor(type)
                        return (
                          <Badge
                            key={type}
                            className={`bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer ring-2 ring-gray-300`}
                          >
                            {type}
                          </Badge>
                        )
                      },
                    )}
                    {POKEMON_TYPES.filter(type => getEffectiveness(type, selectedType) === 0)
                      .length === 0 && <span className='text-gray-500 italic'>None</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
