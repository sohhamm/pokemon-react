"use client";

import { useCallback, useEffect, useRef } from "react";
import { PokemonCard } from "@/components/ui/pokemon-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SimplePokemon } from "@/lib/api/types";

interface PokemonInfiniteGridProps {
  pokemon: SimplePokemon[];
  loading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  emptyMessage?: string;
  onClearFilters?: () => void;
}

export function PokemonInfiniteGrid({ 
  pokemon, 
  loading, 
  hasNextPage, 
  isFetchingNextPage, 
  fetchNextPage,
  emptyMessage, 
  onClearFilters 
}: PokemonInfiniteGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (loading && pokemon.length === 0) {
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

  if (pokemon.length === 0 && !loading) {
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      {/* Infinite scroll trigger and loading indicator */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <LoadingSpinner size="md" message="Loading more Pokemon..." />
        )}
        {hasNextPage && !isFetchingNextPage && (
          <div className="text-gray-500 text-sm">Scroll down to load more...</div>
        )}
        {!hasNextPage && pokemon.length > 0 && (
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">🎉 You've seen all available Pokemon!</div>
            <div className="text-xs text-gray-400">Total: {pokemon.length} Pokemon</div>
          </div>
        )}
      </div>
    </div>
  );
}