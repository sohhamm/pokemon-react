import { PokemonListResponse, Pokemon, PokemonSpecies, EvolutionChain, SimplePokemon, CacheEntry } from './types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const CACHE_KEY_PREFIX = 'pokeapi_cache_';

class PokemonAPIClient {
  private memoryCache = new Map<string, CacheEntry<any>>();

  constructor() {
    this.loadCacheFromStorage();
  }

  private getCacheKey(key: string): string {
    return `${CACHE_KEY_PREFIX}${key}`;
  }

  private loadCacheFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY_PREFIX));
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          const entry = JSON.parse(value) as CacheEntry<any>;
          if (this.isCacheValid(entry)) {
            this.memoryCache.set(key, entry);
          } else {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  private isCacheValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private getFromCache<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    const entry = this.memoryCache.get(cacheKey);
    
    if (entry && this.isCacheValid(entry)) {
      return entry.data as T;
    }

    this.memoryCache.delete(cacheKey);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey);
    }
    
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = CACHE_TTL): void {
    const cacheKey = this.getCacheKey(key);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.memoryCache.set(cacheKey, entry);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }

  private async fetchWithCache<T>(url: string, cacheKey: string, ttl?: number): Promise<T> {
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.setCache(cacheKey, data, ttl);
    return data;
  }

  async getPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
    const url = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    const cacheKey = `pokemon_list_${limit}_${offset}`;
    return this.fetchWithCache<PokemonListResponse>(url, cacheKey);
  }

  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const url = `${API_BASE_URL}/pokemon/${idOrName}`;
    const cacheKey = `pokemon_${idOrName}`;
    return this.fetchWithCache<Pokemon>(url, cacheKey);
  }

  async getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
    const url = `${API_BASE_URL}/pokemon-species/${idOrName}`;
    const cacheKey = `pokemon_species_${idOrName}`;
    return this.fetchWithCache<PokemonSpecies>(url, cacheKey);
  }

  async getEvolutionChain(id: number): Promise<EvolutionChain> {
    const url = `${API_BASE_URL}/evolution-chain/${id}`;
    const cacheKey = `evolution_chain_${id}`;
    return this.fetchWithCache<EvolutionChain>(url, cacheKey);
  }

  async getSimplePokemonList(limit: number = 151): Promise<SimplePokemon[]> {
    const cacheKey = `simple_pokemon_list_${limit}`;
    const cached = this.getFromCache<SimplePokemon[]>(cacheKey);
    if (cached) return cached;

    const listResponse = await this.getPokemonList(limit);
    
    const simplePokemonPromises = listResponse.results.map(async (item, index) => {
      const id = index + 1;
      const pokemon = await this.getPokemon(id);
      
      return {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other?.['official-artwork']?.front_default || 
                pokemon.sprites.front_default || '',
        types: pokemon.types.map(t => t.type.name)
      };
    });

    const simplePokemonList = await Promise.all(simplePokemonPromises);
    this.setCache(cacheKey, simplePokemonList);
    return simplePokemonList;
  }

  async getSimplePokemonListPaginated(limit: number = 20, offset: number = 0): Promise<SimplePokemon[]> {
    const cacheKey = `simple_pokemon_paginated_${limit}_${offset}`;
    const cached = this.getFromCache<SimplePokemon[]>(cacheKey);
    if (cached) return cached;

    const listResponse = await this.getPokemonList(limit, offset);
    
    const simplePokemonPromises = listResponse.results.map(async (item, index) => {
      const id = offset + index + 1;
      const pokemon = await this.getPokemon(id);
      
      return {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other?.['official-artwork']?.front_default || 
                pokemon.sprites.front_default || '',
        types: pokemon.types.map(t => t.type.name)
      };
    });

    const simplePokemonList = await Promise.all(simplePokemonPromises);
    this.setCache(cacheKey, simplePokemonList);
    return simplePokemonList;
  }

  async getBatchPokemon(ids: number[]): Promise<Pokemon[]> {
    const promises = ids.map(id => this.getPokemon(id));
    return Promise.all(promises);
  }

  clearCache(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY_PREFIX));
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
}

export const pokemonAPI = new PokemonAPIClient();