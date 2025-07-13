import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Star } from "lucide-react"
import Image from "next/image"

interface PokemonImageGalleryProps {
  pokemon: {
    name: string
    sprites: {
      front_default: string
      front_shiny: string
      other: {
        "official-artwork": {
          front_default: string
          front_shiny: string
        }
      }
    }
  }
}

export function PokemonImageGallery({ pokemon }: PokemonImageGalleryProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="w-6 h-6" />
          Pokemon Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Normal Form */}
          <div className="text-center group">
            <div className="relative mb-4">
              <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Normal
              </Badge>
              <div className="relative w-64 h-64 mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                  alt={`${pokemon.name} normal`}
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-contain p-4 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 capitalize">{pokemon.name}</h3>
            <p className="text-sm text-gray-600">Standard appearance</p>
          </div>

          {/* Shiny Form */}
          <div className="text-center group">
            <div className="relative mb-4">
              <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                Shiny
              </Badge>
              <div className="relative w-64 h-64 mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-orange-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* Sparkle effects */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-300"></div>
                <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping delay-700"></div>
                <Image
                  src={
                    pokemon.sprites.other["official-artwork"].front_shiny ||
                    pokemon.sprites.front_shiny ||
                    pokemon.sprites.other["official-artwork"].front_default ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={`${pokemon.name} shiny`}
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-contain p-4 relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 capitalize">Shiny {pokemon.name}</h3>
            <p className="text-sm text-gray-600">Rare color variant</p>
          </div>
        </div>

        {/* Gallery Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            About Shiny Pokemon
          </h4>
          <p className="text-sm text-purple-700 leading-relaxed">
            Shiny Pokemon are extremely rare variants with different color schemes. The chance of encountering a shiny
            Pokemon in the wild is approximately 1 in 4,096, making them highly sought after by trainers and collectors.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
