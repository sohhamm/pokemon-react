"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"

interface Pokemon {
  id: number
  name: string
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
}

interface PokemonComparisonChartProps {
  pokemon: Pokemon[]
}

const COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
]

const GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-red-400 to-red-600",
  "from-green-400 to-green-600",
  "from-amber-400 to-amber-600",
  "from-purple-400 to-purple-600",
]

export function PokemonComparisonChart({ pokemon }: PokemonComparisonChartProps) {
  const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"]

  const chartData = statNames.map((statName) => {
    const dataPoint: any = {
      stat: statName.replace("-", " ").replace("special", "sp."),
      fullName: statName,
    }

    pokemon.forEach((p, index) => {
      const stat = p.stats.find((s) => s.stat.name === statName)
      dataPoint[p.name] = stat?.base_stat || 0
    })

    return dataPoint
  })

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="w-full h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl"></div>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} className="drop-shadow-lg">
            <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
            <PolarAngleAxis dataKey="stat" className="text-sm font-medium" tick={{ fill: "#475569", fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 255]}
              className="text-xs"
              tickCount={6}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />
            {pokemon.map((p, index) => (
              <Radar
                key={p.id}
                name={p.name}
                dataKey={p.name}
                stroke={COLORS[index]}
                fill={COLORS[index]}
                fillOpacity={0.15}
                strokeWidth={3}
                dot={{ fill: COLORS[index], strokeWidth: 2, r: 4 }}
              />
            ))}
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Pokemon Legend with Stats */}
      <div className="grid gap-4">
        {pokemon.map((p, index) => {
          const totalStats = p.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
          const gradient = GRADIENTS[index]

          return (
            <div key={p.id} className={`bg-gradient-to-r ${gradient} p-4 rounded-xl text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
                  <span className="font-bold capitalize text-lg">{p.name}</span>
                  <span className="text-sm opacity-90">#{p.id.toString().padStart(3, "0")}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{totalStats}</div>
                  <div className="text-xs opacity-90">Total</div>
                </div>
              </div>

              {/* Mini stat bars */}
              <div className="grid grid-cols-6 gap-2 mt-3">
                {statNames.map((statName) => {
                  const stat = p.stats.find((s) => s.stat.name === statName)
                  const value = stat?.base_stat || 0
                  const percentage = (value / 255) * 100

                  return (
                    <div key={statName} className="text-center">
                      <div className="text-xs opacity-90 mb-1">
                        {statName.replace("-", " ").replace("special", "sp.").toUpperCase()}
                      </div>
                      <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-white h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs font-bold mt-1">{value}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
