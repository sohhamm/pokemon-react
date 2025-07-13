"use client"

import { Combobox, useListCollection } from "@ark-ui/react/combobox"
import { useFilter } from "@ark-ui/react/locale"
import { Portal } from "@ark-ui/react/portal"
import { Search, ChevronDown, Crown, Zap } from "lucide-react"
import { useState } from "react"

interface Pokemon {
  id: number
  name: string
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

interface PokemonComboboxProps {
  pokemonList: Pokemon[]
  selectedPokemon: Pokemon[]
  onSelect: (pokemonId: string) => void
  placeholder?: string
  maxSelections?: number
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

export function PokemonCombobox({
  pokemonList,
  selectedPokemon,
  onSelect,
  placeholder = "🔍 Search and add Pokemon to compare",
  maxSelections = 3,
}: PokemonComboboxProps) {
  const { contains } = useFilter({ sensitivity: "base" })
  const [inputValue, setInputValue] = useState("")

  // Transform Pokemon data for the collection
  const pokemonItems = pokemonList.map((pokemon) => ({
    label: pokemon.name,
    value: pokemon.id.toString(),
    pokemon: pokemon,
  }))

  const { collection, filter } = useListCollection({
    initialItems: pokemonItems,
    filter: (item, query) => {
      // Corrected filter function signature
      if (!query) return true // If no query, all items match
      return (
        contains(item.pokemon.name, query) ||
        item.pokemon.id.toString().includes(query) ||
        item.pokemon.types.some((type) => contains(type.type.name, query))
      )
    },
    itemToString: (item) => item.pokemon.name,
    itemToValue: (item) => item.value,
  })

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    setInputValue(details.inputValue)
    filter(details.inputValue)
  }

  const handleSelect = (details: any) => {
    if (details.value && details.value.length > 0) {
      const selectedValue = details.value[details.value.length - 1]
      onSelect(selectedValue)
      setInputValue("")
    }
  }

  const isMaxSelectionsReached = selectedPokemon.length >= maxSelections

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={handleInputChange}
      onValueChange={handleSelect}
      inputValue={inputValue}
      placeholder={placeholder}
      selectionBehavior="clear"
      openOnClick={true}
      closeOnSelect={true}
    >
      <Combobox.Control className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <Combobox.Input
            className={`
              w-full h-12 pl-12 pr-12 
              border-2 border-gray-200 rounded-xl
              bg-white shadow-sm
              text-gray-900 placeholder-gray-500
              focus:border-blue-400 focus:ring-4 focus:ring-blue-100
              hover:border-gray-300
              transition-all duration-200
              ${isMaxSelectionsReached ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder={isMaxSelectionsReached ? `Maximum ${maxSelections} Pokemon selected` : placeholder}
            disabled={isMaxSelectionsReached}
          />
          <Combobox.Trigger className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </Combobox.Trigger>
        </div>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content
            className="
              bg-white rounded-xl shadow-2xl border border-gray-200
              max-h-80 overflow-y-auto
              z-50 mt-2
              animate-in fade-in-0 zoom-in-95
            "
          >
            {collection.items.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No Pokemon found</p>
                <p className="text-xs text-gray-400 mt-1">Try searching by name, number, or type</p>
              </div>
            ) : (
              <div className="p-2">
                {collection.items.map((item) => {
                  const pokemon = item.pokemon
                  const types = pokemon.types.map((t) => t.type.name)
                  const gradient = getTypeGradient(types)
                  const powerLevel = getPowerLevel(pokemon.stats)
                  const isSelected = selectedPokemon.find((p) => p.id === pokemon.id)
                  const isDisabled = isSelected || selectedPokemon.length >= maxSelections

                  return (
                    <Combobox.Item
                      key={item.value}
                      item={item}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer
                        transition-all duration-200
                        ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]"
                        }
                        ${isSelected ? "bg-blue-50 border border-blue-200" : ""}
                      `}
                      disabled={isDisabled}
                    >
                      {/* Pokemon Avatar */}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} p-2 shadow-lg flex-shrink-0`}
                      >
                        <img
                          src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                          alt={pokemon.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Pokemon Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 font-mono">
                            #{pokemon.id.toString().padStart(3, "0")}
                          </span>
                          <Combobox.ItemText className="font-semibold capitalize text-gray-900 truncate">
                            {pokemon.name}
                          </Combobox.ItemText>
                          {powerLevel === "legendary" && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                          {powerLevel === "strong" && <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                        </div>

                        {/* Types */}
                        <div className="flex gap-1">
                          {pokemon.types.slice(0, 2).map((type) => (
                            <span
                              key={type.type.name}
                              className={`
                                text-xs px-2 py-0.5 rounded-full text-white font-medium
                                bg-gradient-to-r ${getTypeGradient([type.type.name])}
                              `}
                            >
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <Combobox.ItemIndicator className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                    </Combobox.Item>
                  )
                })}
              </div>
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
