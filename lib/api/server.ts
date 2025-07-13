import { unstable_cache } from 'next/cache';
import { PokemonListResponse, Pokemon, PokemonSpecies, EvolutionChain, SimplePokemon } from './types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchFromAPI<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

export const getPokemonList = unstable_cache(
  async (limit: number = 151, offset: number = 0): Promise<PokemonListResponse> => {
    const url = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    return fetchFromAPI<PokemonListResponse>(url);
  },
  ['pokemon-list'],
  {
    revalidate: 86400,
    tags: ['pokemon-list']
  }
);

export const getPokemon = unstable_cache(
  async (idOrName: string | number): Promise<Pokemon> => {
    const url = `${API_BASE_URL}/pokemon/${idOrName}`;
    return fetchFromAPI<Pokemon>(url);
  },
  ['pokemon'],
  {
    revalidate: 86400,
    tags: ['pokemon']
  }
);

export const getPokemonSpecies = unstable_cache(
  async (idOrName: string | number): Promise<PokemonSpecies> => {
    const url = `${API_BASE_URL}/pokemon-species/${idOrName}`;
    return fetchFromAPI<PokemonSpecies>(url);
  },
  ['pokemon-species'],
  {
    revalidate: 86400,
    tags: ['pokemon-species']
  }
);

export const getEvolutionChain = unstable_cache(
  async (id: number): Promise<EvolutionChain> => {
    const url = `${API_BASE_URL}/evolution-chain/${id}`;
    return fetchFromAPI<EvolutionChain>(url);
  },
  ['evolution-chain'],
  {
    revalidate: 86400,
    tags: ['evolution-chain']
  }
);

export async function getSimplePokemonList(limit: number = 151): Promise<SimplePokemon[]> {
  const getCachedSimpleList = unstable_cache(
    async () => {
      const listResponse = await getPokemonList(limit);
      
      const simplePokemonList: SimplePokemon[] = await Promise.all(
        listResponse.results.map(async (item, index) => {
          const id = index + 1;
          const pokemon = await getPokemon(id);
          
          return {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.other?.['official-artwork']?.front_default || 
                    pokemon.sprites.front_default || '',
            types: pokemon.types.map(t => t.type.name)
          };
        })
      );
      
      return simplePokemonList;
    },
    [`simple-pokemon-list-${limit}`],
    {
      revalidate: 86400,
      tags: ['simple-pokemon-list']
    }
  );
  
  return getCachedSimpleList();
}

export async function getPokemonByGeneration(generation: number): Promise<SimplePokemon[]> {
  const generationRanges: Record<number, [number, number]> = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025]
  };

  const [start, end] = generationRanges[generation] || [1, 151];
  const limit = end - start + 1;
  const offset = start - 1;

  const getCachedGeneration = unstable_cache(
    async () => {
      const listResponse = await getPokemonList(limit, offset);
      
      const simplePokemonList: SimplePokemon[] = await Promise.all(
        listResponse.results.map(async (item, index) => {
          const id = start + index;
          const pokemon = await getPokemon(id);
          
          return {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.other?.['official-artwork']?.front_default || 
                    pokemon.sprites.front_default || '',
            types: pokemon.types.map(t => t.type.name)
          };
        })
      );
      
      return simplePokemonList;
    },
    [`pokemon-generation-${generation}`],
    {
      revalidate: 86400,
      tags: [`pokemon-generation-${generation}`]
    }
  );

  return getCachedGeneration();
}