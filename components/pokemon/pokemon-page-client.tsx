"use client";

import { useMemo } from "react";
import { usePokemonStore } from "@/lib/store";
import { PokemonFilters } from "@/components/pokemon/pokemon-filters";
import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { SimplePokemon } from "@/lib/api/types";

interface PokemonPageClientProps {
  initialPokemon: SimplePokemon[];
}

const GENERATIONS = [
  { value: "1", label: "Gen I (1-151)", range: [1, 151] },
  { value: "2", label: "Gen II (152-251)", range: [152, 251] },
  { value: "3", label: "Gen III (252-386)", range: [252, 386] },
  { value: "4", label: "Gen IV (387-493)", range: [387, 493] },
  { value: "5", label: "Gen V (494-649)", range: [494, 649] },
];

export function PokemonPageClient({ initialPokemon }: PokemonPageClientProps) {
  const { filters, setFilters, clearFilters } = usePokemonStore();

  const filteredPokemon = useMemo(() => {
    return initialPokemon.filter((p) => {
      // Name filter
      if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0) {
        if (!filters.types.some((type) => p.types.includes(type))) {
          return false;
        }
      }

      // Generation filter
      if (filters.generation) {
        const gen = GENERATIONS.find((g) => g.value === filters.generation);
        if (gen && (p.id < gen.range[0] || p.id > gen.range[1])) {
          return false;
        }
      }

      return true;
    });
  }, [initialPokemon, filters]);

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <PokemonFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          resultCount={filteredPokemon.length}
          totalCount={initialPokemon.length}
        />
      </div>

      {/* Pokemon Grid */}
      <PokemonGrid
        pokemon={filteredPokemon}
        emptyMessage="No Pokémon found matching your filters."
        onClearFilters={clearFilters}
      />
    </>
  );
}