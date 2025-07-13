"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { pokemonAPI } from "./client";
import { queryKeys } from "./query-keys";
import { SimplePokemon, Pokemon, PokemonSpecies, EvolutionChain } from "./types";

export function useSimplePokemonList(limit: number = 151) {
  return useQuery({
    queryKey: queryKeys.list({ limit }),
    queryFn: () => pokemonAPI.getSimplePokemonList(limit),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useInfiniteSimplePokemonList(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: queryKeys.infiniteList({ limit }),
    queryFn: ({ pageParam = 0 }) => pokemonAPI.getSimplePokemonListPaginated(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * limit;
      const hasMore = lastPage.length === limit && totalLoaded < 1010; // Total known Pokemon
      return hasMore ? allPages.length * limit : undefined;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    initialPageParam: 0,
  });
}

export function usePokemon(idOrName: string | number) {
  return useQuery({
    queryKey: queryKeys.detail(idOrName),
    queryFn: () => pokemonAPI.getPokemon(idOrName),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!idOrName,
  });
}

export function usePokemonSpecies(idOrName: string | number) {
  return useQuery({
    queryKey: queryKeys.speciesDetail(idOrName),
    queryFn: () => pokemonAPI.getPokemonSpecies(idOrName),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!idOrName,
  });
}

export function useEvolutionChain(id: number) {
  return useQuery({
    queryKey: queryKeys.evolutionChain(id),
    queryFn: () => pokemonAPI.getEvolutionChain(id),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!id,
  });
}