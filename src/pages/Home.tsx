// import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
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
    <Box w="100%">
      <SearchSection />

      <Flex direction="column">
        {pokemons.map((pokemon: Pokemon) => (
          <Text>{pokemon.name}</Text>
        ))}
      </Flex>
    </Box>
  );
}
