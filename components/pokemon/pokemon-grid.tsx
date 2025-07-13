"use client";

import { PokemonCard } from "@/components/ui/pokemon-card";
import { SimplePokemon } from "@/lib/api/types";

interface PokemonGridProps {
  pokemon: SimplePokemon[];
  loading?: boolean;
  emptyMessage?: string;
  onClearFilters?: () => void;
}

export function PokemonGrid({ pokemon, loading, emptyMessage, onClearFilters }: PokemonGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-64 shadow-lg">
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-300 rounded-full w-16 ml-auto"></div>
                <div className="h-24 bg-gray-300 rounded-full w-24 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="flex gap-2 justify-center">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-400 rounded-full opacity-50"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pokemon Found</h3>
          <p className="text-gray-500 mb-6">{emptyMessage || "No Pokemon found matching your criteria."}</p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
}