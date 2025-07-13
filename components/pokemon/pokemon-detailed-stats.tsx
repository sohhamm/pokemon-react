import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"

interface PokemonDetailedStatsProps {
  pokemon: {
    stats: Array<{
      base_stat: number
      stat: { name: string }
    }>
  }
}

const STAT_COLORS = {
  hp: "from-red-400 to-red-600",
  attack: "from-orange-400 to-orange-600",
  defense: "from-blue-400 to-blue-600",
  "special-attack": "from-purple-400 to-purple-600",
  "special-defense": "from-green-400 to-green-600",
  speed: "from-yellow-400 to-yellow-600",
}

const STAT_ICONS = {
  hp: "❤️",
  attack: "⚔️",
  defense: "🛡️",
  "special-attack": "✨",
  "special-defense": "🔮",
  speed: "⚡",
}

export function PokemonDetailedStats({ pokemon }: PokemonDetailedStatsProps) {
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  const maxStat = Math.max(...pokemon.stats.map((stat) => stat.base_stat))
  const averageStat = Math.round(totalStats / pokemon.stats.length)

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="w-6 h-6" />
          Detailed Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Individual Stats */}
          <div className="space-y-4">
            {pokemon.stats.map((stat) => {
              const percentage = (stat.base_stat / 255) * 100
              const isHighStat = stat.base_stat >= maxStat * 0.8
              const statKey = stat.stat.name as keyof typeof STAT_COLORS

              return (
                <div key={stat.stat.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{STAT_ICONS[statKey]}</span>
                      <div>
                        <span className="text-sm font-semibold capitalize text-gray-700">
                          {stat.stat.name.replace("-", " ").replace("special", "sp.")}
                        </span>
                        {isHighStat && <div className="text-xs text-yellow-600 font-medium">★ Highest Stat</div>}
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg bg-gradient-to-r ${
                        STAT_COLORS[statKey] || "from-gray-400 to-gray-600"
                      }`}
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg bg-gradient-to-r ${
                          STAT_COLORS[statKey] || "from-gray-400 to-gray-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {/* Stat value indicator */}
                    <div
                      className="absolute top-0 h-4 w-1 bg-white shadow-lg transition-all duration-1000 rounded-full"
                      style={{ left: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-medium">{Math.round(percentage)}%</span>
                    <span>255</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-indigo-800">Total Stats</span>
              </div>
              <div className="text-3xl font-bold text-indigo-800">{totalStats}</div>
              <div className="text-sm text-indigo-600">Combined power</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <span className="font-semibold text-green-800">Average</span>
              </div>
              <div className="text-3xl font-bold text-green-800">{averageStat}</div>
              <div className="text-sm text-green-600">Per stat</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">⭐</span>
                <span className="font-semibold text-yellow-800">Highest</span>
              </div>
              <div className="text-3xl font-bold text-yellow-800">{maxStat}</div>
              <div className="text-sm text-yellow-600">Best stat</div>
            </div>
          </div>

          {/* Battle Rating */}
          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
            <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span className="text-lg">⚔️</span>
              Battle Rating
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((totalStats / 720) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-800">
                  {totalStats > 600 ? "S" : totalStats > 500 ? "A" : totalStats > 400 ? "B" : "C"}
                </div>
                <div className="text-xs text-purple-600">Tier</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
