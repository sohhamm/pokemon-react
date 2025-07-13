import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PokemonTypeBadge } from "@/components/ui/pokemon-type-badge"
import { Info, MapPin, Target } from "lucide-react"

interface PokemonBasicInfoProps {
  pokemon: {
    types: Array<{ type: { name: string } }>
    height: number
    weight: number
    base_experience: number
    abilities: Array<{
      ability: { name: string }
      is_hidden: boolean
    }>
  }
  species?: {
    capture_rate: number
    habitat: { name: string } | null
    generation: { name: string }
  }
}

export function PokemonBasicInfo({ pokemon, species }: PokemonBasicInfoProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden h-fit">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Info className="w-6 h-6" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Types */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            Types
          </h4>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <PokemonTypeBadge key={type.type.name} type={type.type.name} size="md" />
            ))}
          </div>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-800">{(pokemon.height / 10).toFixed(1)}m</div>
            <div className="text-sm text-blue-600">Height</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-800">{(pokemon.weight / 10).toFixed(1)}kg</div>
            <div className="text-sm text-green-600">Weight</div>
          </div>
        </div>

        {/* Experience & Capture Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-800">{pokemon.base_experience}</div>
            <div className="text-sm text-purple-600">Base EXP</div>
          </div>
          {species?.capture_rate && (
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-2xl font-bold text-orange-800">{species.capture_rate}</div>
              <div className="text-sm text-orange-600">Catch Rate</div>
            </div>
          )}
        </div>

        {/* Abilities */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-yellow-600" />
            Abilities
          </h4>
          <div className="space-y-2">
            {pokemon.abilities.map((ability) => (
              <div
                key={ability.ability.name}
                className={`p-3 rounded-lg border-2 ${
                  ability.is_hidden
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize text-gray-800">{ability.ability.name.replace("-", " ")}</span>
                  {ability.is_hidden && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">Hidden</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        {(species?.habitat || species?.generation) && (
          <div className="space-y-3">
            {species?.habitat && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm text-green-600">Habitat</div>
                  <div className="font-medium capitalize text-green-800">{species.habitat.name}</div>
                </div>
              </div>
            )}
            {species?.generation && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                <div>
                  <div className="text-sm text-indigo-600">Generation</div>
                  <div className="font-medium capitalize text-indigo-800">
                    {species.generation.name.replace("-", " ")}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
