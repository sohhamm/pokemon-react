"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X, BarChart3, TrendingUp, Zap, Shield } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PokemonStatsChart } from "@/components/pokemon-stats-chart"
import { PokemonComparisonChart } from "@/components/pokemon-comparison-chart"
import { PokemonCombobox } from "@/components/ui/pokemon-combobox"
import { getPokemonList } from "@/lib/pokemon-service"

interface Pokemon {
  id: number
  name: string
  types: Array<{ type: { name: string } }>
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  sprites: {
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
}

// Remove this function - we'll use the optimized service instead

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

export default function StatsPage() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([])
  const [viewMode, setViewMode] = useState<"individual" | "comparison">("individual")

  const { data: pokemonList = [], isLoading } = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: () => getPokemonList(151),
  })

  const addPokemon = (pokemonId: string) => {
    const pokemon = pokemonList.find((p: Pokemon) => p.id.toString() === pokemonId)
    if (pokemon && selectedPokemon.length < 3 && !selectedPokemon.find((p) => p.id === pokemon.id)) {
      setSelectedPokemon([...selectedPokemon, pokemon])
    }
  }

  const removePokemon = (pokemonId: number) => {
    setSelectedPokemon(selectedPokemon.filter((p) => p.id !== pokemonId))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" message="Loading Pokemon data..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Pokemon Stats Dashboard"
          description="Compare and analyze Pokemon statistics with advanced visualizations"
          backLink="/"
          backText="Back to Pokedex"
        />

        {/* Controls Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Pokemon Combobox */}
                <div className="flex-1 min-w-64">
                  <PokemonCombobox
                    pokemonList={pokemonList}
                    selectedPokemon={selectedPokemon}
                    onSelect={addPokemon}
                    placeholder="🔍 Search and add Pokemon to compare"
                    maxSelections={3}
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={viewMode === "individual" ? "default" : "ghost"}
                    onClick={() => setViewMode("individual")}
                    className={`${
                      viewMode === "individual"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "hover:bg-white"
                    } transition-all`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Individual
                  </Button>
                  <Button
                    variant={viewMode === "comparison" ? "default" : "ghost"}
                    onClick={() => setViewMode("comparison")}
                    disabled={selectedPokemon.length < 2}
                    className={`${
                      viewMode === "comparison"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                        : "hover:bg-white"
                    } transition-all disabled:opacity-50`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Comparison
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Pokemon */}
        {selectedPokemon.length > 0 && (
          <div className="mb-8">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Selected Pokemon ({selectedPokemon.length}/3)</h3>
                  <div className="text-sm text-gray-600">
                    {selectedPokemon.length < 3 && "Add more Pokemon to compare"}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedPokemon.map((pokemon) => {
                    const types = pokemon.types.map((t) => t.type.name)
                    const gradient = getTypeGradient(types)

                    return (
                      <div
                        key={pokemon.id}
                        className={`group relative overflow-hidden bg-gradient-to-r ${gradient} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all`}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white/30"></div>
                          <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-white/30"></div>
                        </div>

                        <div className="relative flex items-center gap-3 text-white">
                          <div className="w-12 h-12 relative">
                            <img
                              src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                              alt={pokemon.name}
                              className="w-full h-full object-contain drop-shadow-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold capitalize text-lg">{pokemon.name}</div>
                            <div className="text-xs opacity-90">#{pokemon.id.toString().padStart(3, "0")}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePokemon(pokemon.id)}
                            className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        {selectedPokemon.length === 0 ? (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <Plus className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Analyze Pokemon?</h3>
              <p className="text-gray-600 text-center max-w-md leading-relaxed">
                Use the search box above to find and select Pokemon. Compare their stats, discover their strengths, and
                uncover insights through interactive visualizations.
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "individual" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPokemon.map((pokemon) => {
              const types = pokemon.types.map((t) => t.type.name)
              const gradient = getTypeGradient(types)
              const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

              return (
                <Card
                  key={pokemon.id}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${gradient} p-4 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 right-2 w-16 h-16 rounded-full border-2 border-white/30"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white/30"></div>
                    </div>
                    <div className="relative flex items-center gap-3">
                      <div className="w-16 h-16 relative">
                        <img
                          src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                          alt={pokemon.name}
                          className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
                        <p className="text-sm opacity-90">#{pokemon.id.toString().padStart(3, "0")}</p>
                        <div className="flex gap-1 mt-2">
                          {pokemon.types.map((type) => (
                            <span key={type.type.name} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{totalStats}</div>
                        <div className="text-xs opacity-90">Total Stats</div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 bg-white">
                    <PokemonStatsChart pokemon={pokemon} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-6 h-6" />
                Pokemon Battle Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <PokemonComparisonChart pokemon={selectedPokemon} />
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Summary Table */}
        {selectedPokemon.length > 0 && (
          <Card className="mt-8 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="w-6 h-6" />
                Detailed Stats Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Pokemon</th>
                      <th className="text-center py-4 px-4 font-semibold text-red-600">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          HP
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-orange-600">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="w-3 h-3" />
                          ATK
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-blue-600">
                        <div className="flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3" />
                          DEF
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-purple-600">Sp. ATK</th>
                      <th className="text-center py-4 px-4 font-semibold text-green-600">Sp. DEF</th>
                      <th className="text-center py-4 px-4 font-semibold text-yellow-600">SPD</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-800">
                        <div className="flex items-center justify-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          Total
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPokemon.map((pokemon, index) => {
                      const stats = pokemon.stats.reduce(
                        (acc, stat) => {
                          acc[stat.stat.name] = stat.base_stat
                          return acc
                        },
                        {} as Record<string, number>,
                      )

                      const total = Object.values(stats).reduce((sum, val) => sum + val, 0)
                      const types = pokemon.types.map((t) => t.type.name)
                      const gradient = getTypeGradient(types)

                      return (
                        <tr
                          key={pokemon.id}
                          className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} p-2 shadow-lg`}>
                                <img
                                  src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                                  alt={pokemon.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <div className="font-semibold capitalize text-gray-800">{pokemon.name}</div>
                                <div className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, "0")}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block">
                              {stats.hp}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block">
                              {stats.attack}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                              {stats.defense}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full inline-block">
                              {stats["special-attack"]}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                              {stats["special-defense"]}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full inline-block">
                              {stats.speed}
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="font-bold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-full inline-block shadow-sm">
                              {total}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
