"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Gamepad2, MapPin, Sparkles, Crown, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Pokemon {
  id: number
  name: string
  types: Array<{ type: { name: string } }>
  sprites: {
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
}

const GENERATIONS = [
  {
    id: 1,
    name: "Generation I",
    shortName: "Gen I",
    year: "1996",
    games: ["Red", "Blue", "Yellow"],
    range: [1, 151],
    region: "Kanto",
    description: "The original 150 Pokemon that started the global phenomenon",
    color: "from-red-500 to-blue-600",
    accentColor: "from-red-100 to-blue-100",
    icon: "🔴",
    features: ["Original 150 Pokemon", "Turn-based battles", "Trading system"],
  },
  {
    id: 2,
    name: "Generation II",
    shortName: "Gen II",
    year: "1999",
    games: ["Gold", "Silver", "Crystal"],
    range: [152, 251],
    region: "Johto",
    description: "Introduced Steel and Dark types, breeding, and day/night cycle",
    color: "from-yellow-500 to-gray-600",
    accentColor: "from-yellow-100 to-gray-100",
    icon: "🟡",
    features: ["Steel & Dark types", "Day/Night cycle", "Pokemon breeding"],
  },
  {
    id: 3,
    name: "Generation III",
    shortName: "Gen III",
    year: "2002",
    games: ["Ruby", "Sapphire", "Emerald"],
    range: [252, 386],
    region: "Hoenn",
    description: "Added abilities, double battles, and Pokemon contests",
    color: "from-red-600 to-emerald-600",
    accentColor: "from-red-100 to-emerald-100",
    icon: "🔺",
    features: ["Pokemon abilities", "Double battles", "Pokemon contests"],
  },
  {
    id: 4,
    name: "Generation IV",
    shortName: "Gen IV",
    year: "2006",
    games: ["Diamond", "Pearl", "Platinum"],
    range: [387, 493],
    region: "Sinnoh",
    description: "Physical/Special split and online trading via WiFi",
    color: "from-blue-600 to-pink-600",
    accentColor: "from-blue-100 to-pink-100",
    icon: "💎",
    features: ["Physical/Special split", "WiFi trading", "Underground areas"],
  },
  {
    id: 5,
    name: "Generation V",
    shortName: "Gen V",
    year: "2010",
    games: ["Black", "White"],
    range: [494, 649],
    region: "Unova",
    description: "Largest generation with 156 new Pokemon and seasonal changes",
    color: "from-gray-800 to-gray-100",
    accentColor: "from-gray-200 to-gray-50",
    icon: "⚫",
    features: ["156 new Pokemon", "Seasonal changes", "Hidden abilities"],
  },
]

async function fetchPokemonByGeneration(start: number, end: number) {
  const pokemonPromises = []
  for (let i = start; i <= Math.min(end, 151); i++) {
    pokemonPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json()))
  }
  return Promise.all(pokemonPromises)
}

function getTypeGradient(types: string[]) {
  const typeColors: Record<string, string> = {
    normal: "from-gray-400 to-gray-500",
    fire: "from-red-500 to-orange-600",
    water: "from-blue-500 to-cyan-600",
    electric: "from-yellow-400 to-yellow-500",
    grass: "from-green-500 to-emerald-600",
    ice: "from-blue-200 to-cyan-400",
    fighting: "from-red-700 to-red-800",
    poison: "from-purple-500 to-purple-700",
    ground: "from-yellow-600 to-amber-700",
    flying: "from-indigo-400 to-sky-500",
    psychic: "from-pink-500 to-purple-600",
    bug: "from-green-400 to-lime-500",
    rock: "from-yellow-800 to-amber-900",
    ghost: "from-purple-700 to-indigo-800",
    dragon: "from-indigo-700 to-purple-800",
    dark: "from-gray-800 to-gray-900",
    steel: "from-gray-500 to-slate-600",
    fairy: "from-pink-300 to-rose-500",
  }

  const primaryType = types[0]
  return typeColors[primaryType] || "from-gray-400 to-gray-500"
}

function getPowerLevel(stats: Array<{ base_stat: number; stat: { name: string } }>) {
  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  if (totalStats > 500) return "legendary"
  if (totalStats > 400) return "strong"
  return "normal"
}

export default function TimelinePage() {
  const [selectedGeneration, setSelectedGeneration] = useState<number>(1)

  const { data: pokemon = [], isLoading } = useQuery({
    queryKey: ["pokemon-generation", selectedGeneration],
    queryFn: () => {
      const gen = GENERATIONS.find((g) => g.id === selectedGeneration)
      if (!gen) return []
      return fetchPokemonByGeneration(gen.range[0], gen.range[1])
    },
  })

  const currentGen = GENERATIONS.find((g) => g.id === selectedGeneration)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="shadow-lg hover:shadow-xl transition-all bg-white/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pokedex
            </Button>
          </Link>
          <div className="flex-1">
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Pokemon Timeline
              </h1>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-lg text-gray-600">Journey through Pokemon history across generations</p>
          </div>
        </div>

        {/* Generation Timeline Selector */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="w-6 h-6" />
              Select Generation Era
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {GENERATIONS.map((gen) => (
                <Button
                  key={gen.id}
                  variant={selectedGeneration === gen.id ? "default" : "outline"}
                  onClick={() => setSelectedGeneration(gen.id)}
                  className={`${
                    selectedGeneration === gen.id
                      ? `bg-gradient-to-r ${gen.color} text-white shadow-lg scale-105`
                      : `hover:bg-gradient-to-r hover:${gen.color} hover:text-white hover:shadow-md`
                  } transition-all h-auto p-4 flex flex-col items-center gap-2`}
                >
                  <div className="text-2xl">{gen.icon}</div>
                  <div className="text-center">
                    <div className="font-bold">{gen.shortName}</div>
                    <div className="text-xs opacity-90">{gen.year}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generation Details */}
        {currentGen && (
          <Card className="mb-8 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${currentGen.color} text-white relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/30"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/30"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full border border-white/20"></div>
              </div>

              <CardTitle className="relative flex items-center gap-4 text-2xl">
                <div className="p-3 bg-white/20 rounded-xl">
                  <div className="text-3xl">{currentGen.icon}</div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    {currentGen.name} - {currentGen.region} Region
                    <Badge className="bg-white/20 text-white border-white/30 text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {currentGen.year}
                    </Badge>
                  </div>
                  <div className="text-base opacity-90 font-normal mt-1">{currentGen.description}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Games */}
                <div className={`p-6 rounded-xl bg-gradient-to-br ${currentGen.accentColor}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Gamepad2 className="w-5 h-5 text-gray-700" />
                    <h3 className="font-bold text-gray-800">Featured Games</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentGen.games.map((game) => (
                      <Badge key={game} className={`bg-gradient-to-r ${currentGen.color} text-white shadow-md`}>
                        Pokemon {game}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pokemon Range */}
                <div className={`p-6 rounded-xl bg-gradient-to-br ${currentGen.accentColor}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-700" />
                    <h3 className="font-bold text-gray-800">Pokemon Range</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-800">
                      #{currentGen.range[0].toString().padStart(3, "0")} - #
                      {currentGen.range[1].toString().padStart(3, "0")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentGen.range[1] - currentGen.range[0] + 1} new Pokemon introduced
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div
                  className={`p-6 rounded-xl bg-gradient-to-br ${currentGen.accentColor} md:col-span-2 lg:col-span-1`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-gray-700" />
                    <h3 className="font-bold text-gray-800">Key Features</h3>
                  </div>
                  <div className="space-y-2">
                    {currentGen.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pokemon Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <div
                className={`animate-spin rounded-full h-32 w-32 border-b-4 border-gradient-to-r ${currentGen?.color} mx-auto`}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-12 h-12 text-violet-500 animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-gray-600">Loading {currentGen?.name} Pokemon...</p>
            <p className="text-sm text-gray-500 mt-2">Discovering Pokemon from {currentGen?.year}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{currentGen?.name} Pokemon Collection</h2>
              <Badge className={`bg-gradient-to-r ${currentGen?.color} text-white text-lg px-4 py-2`}>
                {pokemon.length} Pokemon
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {pokemon.map((p: Pokemon) => {
                const types = p.types.map((t) => t.type.name)
                const gradient = getTypeGradient(types)
                const powerLevel = getPowerLevel(p.stats)
                const totalStats = p.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

                return (
                  <Link key={p.id} href={`/pokemon/${p.id}`}>
                    <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer border-0 shadow-lg hover:shadow-2xl overflow-hidden h-80">
                      {/* Header with gradient */}
                      <div className={`bg-gradient-to-r ${gradient} p-4 text-white relative overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-2 right-2 w-12 h-12 rounded-full border-2 border-white/30"></div>
                          <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/30"></div>
                        </div>

                        <div className="relative flex items-center justify-between">
                          <div>
                            <div className="text-xs opacity-90">#{p.id.toString().padStart(3, "0")}</div>
                            <div className="font-bold capitalize text-lg">{p.name}</div>
                          </div>
                          {powerLevel === "legendary" && (
                            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                              <Crown className="w-3 h-3" />
                            </div>
                          )}
                          {powerLevel === "strong" && (
                            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                              <Zap className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pokemon Image */}
                      <CardContent className="p-6 bg-white flex-1 flex flex-col">
                        <div className="flex-1 flex items-center justify-center mb-4">
                          <div className="relative w-24 h-24 group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-xl opacity-50"></div>
                            <Image
                              src={p.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                              alt={p.name}
                              fill
                              className="object-contain relative z-10 drop-shadow-lg"
                            />
                          </div>
                        </div>

                        {/* Type badges */}
                        <div className="flex gap-1 justify-center mb-3">
                          {p.types.map((type) => (
                            <Badge
                              key={type.type.name}
                              className={`bg-gradient-to-r ${getTypeGradient([type.type.name])} text-white text-xs shadow-md`}
                            >
                              {type.type.name}
                            </Badge>
                          ))}
                        </div>

                        {/* Stats preview */}
                        <div className="text-center">
                          <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                            <div className="font-semibold">Total: {totalStats}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
