"use client"

interface Pokemon {
  name: string
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
}

interface PokemonStatsChartProps {
  pokemon: Pokemon
}

const STAT_COLORS = {
  hp: "bg-gradient-to-r from-red-400 to-red-600",
  attack: "bg-gradient-to-r from-orange-400 to-orange-600",
  defense: "bg-gradient-to-r from-blue-400 to-blue-600",
  "special-attack": "bg-gradient-to-r from-purple-400 to-purple-600",
  "special-defense": "bg-gradient-to-r from-green-400 to-green-600",
  speed: "bg-gradient-to-r from-yellow-400 to-yellow-600",
}

const STAT_ICONS = {
  hp: "❤️",
  attack: "⚔️",
  defense: "🛡️",
  "special-attack": "✨",
  "special-defense": "🔮",
  speed: "⚡",
}

export function PokemonStatsChart({ pokemon }: PokemonStatsChartProps) {
  if (!pokemon || !pokemon.stats || pokemon.stats.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-muted-foreground">No stats data available</p>
      </div>
    )
  }

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  const maxStat = Math.max(...pokemon.stats.map((stat) => stat.base_stat))

  return (
    <div className="space-y-4">
      {pokemon.stats.map((stat) => {
        const percentage = (stat.base_stat / 255) * 100
        const isHighStat = stat.base_stat >= maxStat * 0.8

        return (
          <div key={stat.stat.name} className="group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{STAT_ICONS[stat.stat.name as keyof typeof STAT_ICONS]}</span>
                <span className="text-sm font-semibold capitalize text-gray-700">
                  {stat.stat.name.replace("-", " ").replace("special", "sp.")}
                </span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg ${
                  isHighStat ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gray-500"
                }`}
              >
                {stat.base_stat}
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg ${
                    STAT_COLORS[stat.stat.name as keyof typeof STAT_COLORS] || "bg-gray-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {/* Stat value indicator */}
              <div
                className="absolute top-0 h-3 w-0.5 bg-white shadow-lg transition-all duration-1000"
                style={{ left: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}

      {/* Total Stats Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-bold text-gray-800">Total Stats</span>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            {totalStats}
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${Math.min((totalStats / 720) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
