"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, GitBranch, Sparkles } from "lucide-react"
import Link from "next/link"
import { EvolutionChain } from "@/components/evolution-chain"
import { PokemonCombobox } from "@/components/ui/pokemon-combobox"
import { Button } from "@/components/ui/button"

interface Pokemon {
  id: number
  name: string
  species: {
    url: string
  }
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

interface PokemonSpecies {
  evolution_chain: {
    url: string
  }
  habitat: { name: string } | null
  capture_rate: number
}

async function fetchPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const data = await response.json()

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: any, index: number) => {
      const detailResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`)
      return detailResponse.json()
    }),
  )

  return pokemonDetails
}

async function fetchPokemonSpecies(url: string): Promise<PokemonSpecies> {
  const response = await fetch(url)
  return response.json()
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

export default function EvolutionPage() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([])

  const { data: pokemonList = [], isLoading } = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: fetchPokemonList,
  })

  const selectedPokemonData = selectedPokemon[0] // Only use the first selected Pokemon

  const { data: species } = useQuery({
    queryKey: ["pokemon-species", selectedPokemonData?.species.url],
    queryFn: () => fetchPokemonSpecies(selectedPokemonData!.species.url),
    enabled: !!selectedPokemonData?.species.url,
  })

  const handlePokemonSelect = (pokemonId: string) => {
    const pokemon = pokemonList.find((p: Pokemon) => p.id.toString() === pokemonId)
    if (pokemon) {
      setSelectedPokemon([pokemon]) // Replace the current selection
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-emerald-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <GitBranch className="w-12 h-12 text-emerald-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-xl text-gray-600">Loading Pokemon evolution data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Evolution Trees
              </h1>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-lg text-gray-600">Discover Pokemon evolution chains and transformation requirements</p>
          </div>
        </div>

        {/* Pokemon Selector */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6" />
              Select a Pokemon to Explore
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <PokemonCombobox
                  pokemonList={pokemonList}
                  selectedPokemon={selectedPokemon}
                  onSelect={handlePokemonSelect}
                  placeholder="🔍 Choose a Pokemon to see its evolution tree"
                  maxSelections={1}
                />
              </div>

              {selectedPokemonData && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <div className="w-12 h-12 relative">
                    <img
                      src={selectedPokemonData.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                      alt={selectedPokemonData.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <div className="font-bold capitalize text-emerald-800">{selectedPokemonData.name}</div>
                    <div className="text-xs text-emerald-600">
                      #{selectedPokemonData.id.toString().padStart(3, "0")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evolution Chain Display */}
        {selectedPokemonData && species ? (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-white/30"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/30"></div>
                <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full border border-white/20"></div>
              </div>

              <CardTitle className="relative flex items-center gap-3 text-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div>
                  <div className="capitalize">{selectedPokemonData.name} Evolution Chain</div>
                  <div className="text-sm opacity-90 font-normal">Discover the complete evolutionary journey</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-emerald-300"></div>
                  <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-teal-300"></div>
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-cyan-300"></div>
                </div>

                <div className="relative z-10">
                  <EvolutionChain evolutionChainUrl={species.evolution_chain.url} />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : selectedPokemonData ? (
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-700">Loading evolution chain...</p>
                <p className="text-sm text-gray-500 mt-2">Discovering evolutionary connections</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                  <GitBranch className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse delay-300"></div>
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Explore Evolution?</h3>
              <p className="text-gray-600 text-center max-w-md leading-relaxed mb-6">
                Use the search box above to find a Pokemon and discover its complete evolution chain, requirements, and
                transformational journey through different forms.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GitBranch className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-1">Evolution Chains</h4>
                  <p className="text-xs text-emerald-600">Complete evolutionary paths</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-teal-800 mb-1">Requirements</h4>
                  <p className="text-xs text-teal-600">Evolution conditions</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GitBranch className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-cyan-800 mb-1">Transformations</h4>
                  <p className="text-xs text-cyan-600">Visual evolution journey</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
