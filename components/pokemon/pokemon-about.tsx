import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Egg } from "lucide-react"

interface PokemonAboutProps {
  flavorText: string
  species?: {
    egg_groups: Array<{ name: string }>
    generation: { name: string }
  }
}

export function PokemonAbout({ flavorText, species }: PokemonAboutProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className="w-6 h-6" />
          About This Pokemon
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Description */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            <span className="text-lg">📖</span>
            Pokedex Entry
          </h4>
          <p className="text-green-700 leading-relaxed text-lg">{flavorText}</p>
        </div>

        {/* Breeding Info */}
        {species?.egg_groups && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Egg className="w-5 h-5" />
              Breeding Information
            </h4>
            <div>
              <div className="text-sm text-blue-600 mb-2">Egg Groups</div>
              <div className="flex flex-wrap gap-2">
                {species.egg_groups.map((group) => (
                  <Badge
                    key={group.name}
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {group.name.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generation Info */}
        {species?.generation && (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🎮</span>
              Origin
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {species.generation.name.split("-")[1]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="font-semibold text-purple-800 capitalize">
                  {species.generation.name.replace("-", " ")}
                </div>
                <div className="text-sm text-purple-600">First appeared in this generation</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
