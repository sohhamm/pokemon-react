import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-400/50",
  fire: "bg-gradient-to-r from-red-500 to-orange-600 shadow-red-500/50",
  water: "bg-gradient-to-r from-blue-500 to-cyan-600 shadow-blue-500/50",
  electric: "bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-400/50",
  grass: "bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/50",
  ice: "bg-gradient-to-r from-blue-200 to-cyan-400 shadow-blue-300/50",
  fighting: "bg-gradient-to-r from-red-700 to-red-800 shadow-red-700/50",
  poison: "bg-gradient-to-r from-purple-500 to-purple-700 shadow-purple-500/50",
  ground: "bg-gradient-to-r from-yellow-600 to-amber-700 shadow-yellow-600/50",
  flying: "bg-gradient-to-r from-indigo-400 to-sky-500 shadow-indigo-400/50",
  psychic: "bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/50",
  bug: "bg-gradient-to-r from-green-400 to-lime-500 shadow-green-400/50",
  rock: "bg-gradient-to-r from-yellow-800 to-amber-900 shadow-yellow-800/50",
  ghost: "bg-gradient-to-r from-purple-700 to-indigo-800 shadow-purple-700/50",
  dragon: "bg-gradient-to-r from-indigo-700 to-purple-800 shadow-indigo-700/50",
  dark: "bg-gradient-to-r from-gray-800 to-gray-900 shadow-gray-800/50",
  steel: "bg-gradient-to-r from-gray-500 to-slate-600 shadow-gray-500/50",
  fairy: "bg-gradient-to-r from-pink-300 to-rose-500 shadow-pink-400/50",
}

interface PokemonTypeBadgeProps {
  type: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline"
  className?: string
}

export function PokemonTypeBadge({ type, size = "md", variant = "default", className }: PokemonTypeBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  if (variant === "outline") {
    return (
      <Badge variant="outline" className={cn("capitalize border-2", sizeClasses[size], className)}>
        {type}
      </Badge>
    )
  }

  return (
    <Badge
      className={cn(
        TYPE_COLORS[type] || "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-400/50",
        "text-white border-0 shadow-lg hover:shadow-xl transition-shadow font-medium",
        sizeClasses[size],
        className,
      )}
    >
      {type}
    </Badge>
  )
}
