export const queryKeys = {
  all: ['pokemon'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: { limit?: number; offset?: number }) =>
    [...queryKeys.lists(), filters] as const,
  infiniteList: (filters: { limit?: number }) =>
    [...queryKeys.lists(), 'infinite', filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (idOrName: string | number) => [...queryKeys.details(), idOrName] as const,
  species: () => [...queryKeys.all, 'species'] as const,
  speciesDetail: (idOrName: string | number) => [...queryKeys.species(), idOrName] as const,
  evolution: () => [...queryKeys.all, 'evolution'] as const,
  evolutionChain: (id: number) => [...queryKeys.evolution(), id] as const,
  generation: (gen: number) => [...queryKeys.all, 'generation', gen] as const,
};