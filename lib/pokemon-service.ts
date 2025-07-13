// Centralized Pokemon data service with caching and optimization
export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: {
    other: {
      "official-artwork": {
        front_default: string
        front_shiny?: string
      }
    }
    front_default: string
    front_shiny?: string
  }
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  types: Array<{
    type: { name: string }
  }>
  abilities: Array<{
    ability: { name: string; url: string }
    is_hidden: boolean
    slot: number
  }>
  species: {
    name: string
    url: string
  }
}

// In-memory cache for Pokemon data
const pokemonCache = new Map<number, PokemonDetail>()
const listCache = new Map<string, PokemonDetail[]>()

// Batch fetch Pokemon details efficiently
async function batchFetchPokemon(ids: number[]): Promise<PokemonDetail[]> {
  const uncachedIds = ids.filter(id => !pokemonCache.has(id))
  
  if (uncachedIds.length === 0) {
    return ids.map(id => pokemonCache.get(id)!)
  }

  // Fetch uncached Pokemon in batches to avoid overwhelming the API
  const batchSize = 20
  const batches: Promise<PokemonDetail>[] = []
  
  for (let i = 0; i < uncachedIds.length; i += batchSize) {
    const batch = uncachedIds.slice(i, i + batchSize)
    const batchPromises = batch.map(async (id) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const pokemon = await response.json()
      pokemonCache.set(id, pokemon)
      return pokemon
    })
    batches.push(...batchPromises)
  }

  await Promise.all(batches)
  
  return ids.map(id => pokemonCache.get(id)!)
}

// Get Pokemon list with efficient caching
export async function getPokemonList(limit = 151): Promise<PokemonDetail[]> {
  const cacheKey = `list-${limit}`
  
  if (listCache.has(cacheKey)) {
    return listCache.get(cacheKey)!
  }

  // Generate array of Pokemon IDs (1 to limit)
  const pokemonIds = Array.from({ length: limit }, (_, i) => i + 1)
  
  const pokemonList = await batchFetchPokemon(pokemonIds)
  listCache.set(cacheKey, pokemonList)
  
  return pokemonList
}

// Get single Pokemon (uses cache if available)
export async function getPokemon(id: number): Promise<PokemonDetail> {
  if (pokemonCache.has(id)) {
    return pokemonCache.get(id)!
  }
  
  const pokemon = await batchFetchPokemon([id])
  return pokemon[0]
}

// Get Pokemon by generation range
export async function getPokemonByGeneration(start: number, end: number): Promise<PokemonDetail[]> {
  const pokemonIds = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  return batchFetchPokemon(pokemonIds)
}

// Preload commonly accessed Pokemon (first 151)
export async function preloadPokemonData(): Promise<void> {
  if (!listCache.has('list-151')) {
    await getPokemonList(151)
  }
}

// Clear cache (useful for testing or manual refresh)
export function clearPokemonCache(): void {
  pokemonCache.clear()
  listCache.clear()
}