// import React from 'react';

import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import PokemonCard from '../components/pokemon-card/PokemonCard';
import SearchSection from '../components/search-section/SearchSection';
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

  console.log(pokemons);

  if (error) return <Text>error</Text>;
  if (isLoading) return <Text>loading..</Text>;
  return (
    <Box w="100%" bg="#0A122A">
      <SearchSection />
      <SimpleGrid columns={3} spacing={10}>
        {pokemons.map((pokemon: Pokemon) => (
          <PokemonCard pokemon={pokemon} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
