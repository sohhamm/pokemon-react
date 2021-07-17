// import React from 'react';

import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import PokemonCard from '../components/pokemon-card/PokemonCard';
import SearchSection from '../components/search-section/SearchSection';
import { useSearchStore } from '../store/search-store';
import { Pokemon } from '../types';

const URL = 'https://pokeapi.co/api/v2/pokemon';

const getAllPokemons = async () => {
  try {
    const pokemons = await (
      await fetch(URL, {
        method: 'GET',
      })
    ).json();
    return pokemons.results;
  } catch (err) {
    console.error(err);
  }
};

export default function Home() {
  // const queryClient = useQueryClient();
  const {
    data: pokemons,
    isLoading,
    error,
  } = useQuery('pokemons', getAllPokemons);
  const searchTerm = useSearchStore((state) => state.searchTerm);

  // console.log(pokemons);

  if (error) return <Text>error</Text>;
  if (isLoading) return <Text>loading..</Text>;
  return (
    <Box w="100%" bg="#0A122A">
      <SearchSection />
      <SimpleGrid columns={3} spacing={10} border="white" mx="auto" w="100%">
        {pokemons
          .filter((pokemon: Pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((pokemon: Pokemon) => (
            <PokemonCard pokemon={pokemon} key={pokemon.name} />
          ))}
      </SimpleGrid>
    </Box>
  );
}
