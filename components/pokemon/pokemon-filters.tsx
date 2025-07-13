"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createListCollection } from "@ark-ui/react/select"
import { Search, Filter, X } from "lucide-react"

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

const GENERATIONS = [
  { value: "all", label: "All Generations" },
  { value: "1", label: "Gen I (1-151)", range: [1, 151] },
  { value: "2", label: "Gen II (152-251)", range: [152, 251] },
  { value: "3", label: "Gen III (252-386)", range: [252, 386] },
  { value: "4", label: "Gen IV (387-493)", range: [387, 493] },
  { value: "5", label: "Gen V (494-649)", range: [494, 649] },
]

interface Filters {
  name: string
  types: string[]
  generation: string
}

interface PokemonFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Partial<Filters>) => void
  onClearFilters: () => void
  resultCount?: number
  totalCount?: number
}

export function PokemonFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  totalCount,
}: PokemonFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleTypeFilter = (type: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({ types: [...filters.types, type] })
    } else {
      onFiltersChange({ types: filters.types.filter((t) => t !== type) })
    }
  }

  const generationCollection = createListCollection({
    items: GENERATIONS,
  })

  const hasActiveFilters = filters.name || filters.types.length > 0 || filters.generation

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search Pokemon..."
            value={filters.name}
            onChange={(e) => onFiltersChange({ name: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Results Count */}
      {resultCount !== undefined && totalCount !== undefined && (
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} of {totalCount} Pokemon
        </p>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Generation Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Generation</Label>
              <Select 
                collection={generationCollection}
                value={[filters.generation || "all"]}
                onValueChange={(details) => {
                  const value = details.value[0]
                  onFiltersChange({ generation: value === "all" ? "" : value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Generations" />
                </SelectTrigger>
                <SelectContent>
                  {generationCollection.items.map((gen) => (
                    <SelectItem key={gen.value} item={gen}>
                      {gen.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium mb-2 block">Types</Label>
              <div className="grid grid-cols-3 gap-2">
                {POKEMON_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.types.includes(type)}
                      onCheckedChange={(details) => handleTypeFilter(type, Boolean(details.checked))}
                    />
                    <Label htmlFor={type} className="text-sm capitalize">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
