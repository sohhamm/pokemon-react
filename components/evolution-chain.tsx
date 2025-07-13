"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Crown, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EvolutionChain {
  chain: {
    species: { name: string; url: string }
    evolves_to: Array<{
      species: { name: string; url: string }
      evolution_details: Array<{
        min_level?: number
        item?: { name: string }
        trigger: { name: string }
        time_of_day?: string
        location?: { name: string }
        held_item?: { name: string }
        known_move?: { name: string }
        min_happiness?: number
        min_beauty?: number
        min_affection?: number
        needs_overworld_rain?: boolean
        party_species?: { name: string }
        party_type?: { name: string }
        relative_physical_stats?: number
        trade_species?: { name: string }
        turn_upside_down?: boolean
      }>
      evolves_to: Array<{
        species: { name: string; url: string }
        evolution_details: Array<{
          min_level?: number
          item?: { name: string }
          trigger: { name: string }
          time_of_day?: string
          location?: { name: string }
          held_item?: { name: string }
          known_move?: { name: string }
          min_happiness?: number
          min_beauty?: number
          min_affection?: number
          needs_overworld_rain?: boolean
          party_species?: { name: string }
          party_type?: { name: string }
          relative_physical_stats?: number
          trade_species?: { name: string }
          turn_upside_down?: boolean
        }>
      }>
    }>
  }
}

interface PokemonSpecies {
  id: number
  name: string
}

interface PokemonDetail {
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

async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const response = await fetch(url)
  return response.json()
}

async function fetchPokemonSpecies(url: string): Promise<PokemonSpecies> {
  const response = await fetch(url)
  return response.json()
}

async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
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

function getPowerLevel(stats: Array<{ base_stat: number; stat: { name: string } }>) {
  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  if (totalStats > 500) return "legendary"
  if (totalStats > 400) return "strong"
  return "normal"
}

function formatEvolutionRequirement(detail: any): string {
  const requirements = []

  if (detail.min_level) requirements.push(`Level ${detail.min_level}`)
  if (detail.item) requirements.push(`Use ${detail.item.name.replace("-", " ")}`)
  if (detail.held_item) requirements.push(`Hold ${detail.held_item.name.replace("-", " ")}`)
  if (detail.known_move) requirements.push(`Know ${detail.known_move.name.replace("-", " ")}`)
  if (detail.min_happiness) requirements.push(`Happiness ${detail.min_happiness}+`)
  if (detail.min_affection) requirements.push(`Affection ${detail.min_affection}+`)
  if (detail.min_beauty) requirements.push(`Beauty ${detail.min_beauty}+`)
  if (detail.time_of_day) requirements.push(`${detail.time_of_day} time`)
  if (detail.location) requirements.push(`At ${detail.location.name.replace("-", " ")}`)
  if (detail.needs_overworld_rain) requirements.push("During rain")
  if (detail.turn_upside_down) requirements.push("Turn console upside down")
  if (detail.party_species) requirements.push(`With ${detail.party_species.name} in party`)
  if (detail.party_type) requirements.push(`With ${detail.party_type.name} type in party`)
  if (detail.trade_species) requirements.push(`Trade for ${detail.trade_species.name}`)

  if (detail.trigger.name === "trade" && requirements.length === 0) requirements.push("Trade")
  if (detail.trigger.name === "use-item" && requirements.length === 0) requirements.push("Use Item")
  if (detail.trigger.name === "level-up" && requirements.length === 0) requirements.push("Level Up")

  return requirements.join(", ") || "Level Up"
}

interface EvolutionChainProps {
  evolutionChainUrl: string
}

export function EvolutionChain({ evolutionChainUrl }: EvolutionChainProps) {
  const { data: evolutionChain, isLoading } = useQuery({
    queryKey: ["evolution-chain", evolutionChainUrl],
    queryFn: () => fetchEvolutionChain(evolutionChainUrl),
  })

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading evolution chain...</p>
      </div>
    )
  }

  if (!evolutionChain) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Evolution chain not available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EvolutionStageComponent stage={evolutionChain.chain} />
    </div>
  )
}

function EvolutionStageComponent({ stage }: { stage: any }) {
  const { data: species } = useQuery({
    queryKey: ["pokemon-species", stage.species.url],
    queryFn: () => fetchPokemonSpecies(stage.species.url),
  })

  const { data: pokemon } = useQuery({
    queryKey: ["pokemon-detail", species?.id],
    queryFn: () => fetchPokemonDetail(species!.id),
    enabled: !!species,
  })

  if (!species || !pokemon) {
    return (
      <div className="animate-pulse">
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-40 rounded-xl shadow-lg"></div>
      </div>
    )
  }

  const types = pokemon.types.map((t) => t.type.name)
  const gradient = getTypeGradient(types)
  const powerLevel = getPowerLevel(pokemon.stats)
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Pokemon Card */}
      <Link href={`/pokemon/${species.id}`}>
        <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 overflow-hidden w-64">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${gradient} p-4 text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 w-12 h-12 rounded-full border-2 border-white/30"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/30"></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold capitalize">{species.name}</h3>
                <p className="text-sm opacity-90">#{species.id.toString().padStart(3, "0")}</p>
              </div>
              <div className="flex items-center gap-1">
                {powerLevel === "legendary" && (
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3" />
                    <span className="text-xs">Legendary</span>
                  </div>
                )}
                {powerLevel === "strong" && (
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs">Strong</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pokemon Image */}
          <CardContent className="p-6 bg-white text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-xl opacity-50"></div>
              <Image
                src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                alt={species.name}
                fill
                className="object-contain relative z-10 drop-shadow-lg"
              />
            </div>

            {/* Type badges */}
            <div className="flex gap-1 justify-center mb-3">
              {pokemon.types.map((type) => (
                <Badge
                  key={type.type.name}
                  className={`bg-gradient-to-r ${getTypeGradient([type.type.name])} text-white text-xs shadow-md`}
                >
                  {type.type.name}
                </Badge>
              ))}
            </div>

            {/* Stats summary */}
            <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
              <div className="font-semibold">Total Stats: {totalStats}</div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Evolution Arrow and Requirements */}
      {stage.evolves_to.length > 0 && (
        <>
          <div className="flex flex-col items-center gap-3 mx-4">
            <div className="p-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>

            {/* Evolution Requirements */}
            <div className="flex flex-col gap-2 max-w-48">
              {stage.evolves_to[0].evolution_details.map((detail: any, index: number) => {
                const requirement = formatEvolutionRequirement(detail)
                return (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs text-center bg-white shadow-md border-emerald-200 hover:bg-emerald-50 transition-colors"
                  >
                    {requirement}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Next Evolution Stages */}
          <div className="flex flex-col gap-6">
            {stage.evolves_to.map((evolution: any) => (
              <EvolutionStageComponent key={evolution.species.name} stage={evolution} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
