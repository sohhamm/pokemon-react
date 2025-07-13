import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { PokemonTypeBadge } from "./pokemon-type-badge"
import { Star, Zap } from "lucide-react"
import { SimplePokemon, Pokemon } from "@/lib/api/types"

type PokemonData = SimplePokemon | Pokemon;

interface PokemonCardProps {
  pokemon: PokemonData
  showNumber?: boolean
  size?: "sm" | "md" | "lg"
}

function isFullPokemon(pokemon: PokemonData): pokemon is Pokemon {
  return 'height' in pokemon && 'weight' in pokemon;
}

function getPokemonTypes(pokemon: PokemonData): string[] {
  if ('types' in pokemon && Array.isArray(pokemon.types)) {
    if (typeof pokemon.types[0] === 'string') {
      return pokemon.types as string[];
    } else {
      return (pokemon.types as any[]).map((t) => t.type.name);
    }
  }
  return [];
}

function getPokemonSprite(pokemon: PokemonData): string {
  if ('sprite' in pokemon && pokemon.sprite) {
    return pokemon.sprite;
  }
  if ('sprites' in pokemon) {
    return pokemon.sprites.other?.['official-artwork']?.front_default ||
           pokemon.sprites.front_default ||
           '/placeholder.svg';
  }
  return '/placeholder.svg';
}

function getTypeGradient(types: string[]) {
  const typeColors: Record<string, string> = {
    normal: "from-gray-300 to-gray-400",
    fire: "from-red-400 to-orange-500",
    water: "from-blue-400 to-cyan-500",
    electric: "from-yellow-300 to-yellow-500",
    grass: "from-green-400 to-emerald-500",
    ice: "from-blue-200 to-cyan-300",
    fighting: "from-red-600 to-red-700",
    poison: "from-purple-400 to-purple-600",
    ground: "from-yellow-600 to-amber-700",
    flying: "from-indigo-300 to-sky-400",
    psychic: "from-pink-400 to-purple-500",
    bug: "from-green-400 to-lime-500",
    rock: "from-yellow-700 to-amber-800",
    ghost: "from-purple-600 to-indigo-700",
    dragon: "from-indigo-600 to-purple-700",
    dark: "from-gray-700 to-gray-900",
    steel: "from-gray-400 to-slate-500",
    fairy: "from-pink-300 to-rose-400",
  }

  const primaryType = types[0]
  return typeColors[primaryType] || "from-gray-300 to-gray-400"
}

export function PokemonCard({ pokemon, showNumber = true, size = "md" }: PokemonCardProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-36 h-36",
  }

  const cardSizes = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
  }

  const types = getPokemonTypes(pokemon);
  const gradient = getTypeGradient(types)
  const sprite = getPokemonSprite(pokemon);

  // Calculate total stats for power indicator (only for full Pokemon data)
  let powerLevel = "normal";
  if (isFullPokemon(pokemon) && pokemon.stats) {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    powerLevel = totalStats > 500 ? "legendary" : totalStats > 400 ? "strong" : "normal";
  }

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card
        className={`group hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl ${cardSizes[size]} relative`}
      >
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
        />

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="w-16 h-16 rounded-full border-2 border-white" />
        </div>
        <div className="absolute bottom-2 left-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-white" />
        </div>

        {/* Power Level Indicator */}
        {powerLevel === "legendary" && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Legendary
            </Badge>
          </div>
        )}
        {powerLevel === "strong" && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Strong
            </Badge>
          </div>
        )}

        <CardContent className="p-6 relative z-10 h-full flex flex-col">
          {/* Pokemon Number */}
          {showNumber && (
            <div className="text-right mb-2">
              <span className="text-xs font-bold text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                #{pokemon.id.toString().padStart(3, "0")}
              </span>
            </div>
          )}

          {/* Pokemon Image */}
          <div className="flex-1 flex items-center justify-center mb-4">
            <div className={`relative ${sizeClasses[size]} group-hover:scale-110 transition-transform duration-300`}>
              <div className="absolute inset-0 bg-white/50 rounded-full blur-xl group-hover:bg-white/70 transition-colors" />
              <Image
                src={sprite}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="object-contain relative z-10 drop-shadow-lg"
              />
            </div>
          </div>

          {/* Pokemon Info */}
          <div className="text-center space-y-3">
            <h3 className="font-bold text-lg capitalize text-gray-800 group-hover:text-gray-900 transition-colors">
              {pokemon.name}
            </h3>

            {/* Type Badges */}
            <div className="flex gap-1 justify-center">
              {types.map((type, index) => (
                <PokemonTypeBadge
                  key={type}
                  type={type}
                  size="sm"
                  className={`shadow-md ${index === 0 ? "ring-2 ring-white/50" : ""}`}
                />
              ))}
            </div>

            {/* Stats Preview */}
            {isFullPokemon(pokemon) && pokemon.stats && (
              <div className="flex justify-center gap-2 text-xs">
                <div className="bg-white/80 px-2 py-1 rounded-full">
                  <span className="font-medium">HP: {pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat}</span>
                </div>
                <div className="bg-white/80 px-2 py-1 rounded-full">
                  <span className="font-medium">
                    ATK: {pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </CardContent>
      </Card>
    </Link>
  )
}
