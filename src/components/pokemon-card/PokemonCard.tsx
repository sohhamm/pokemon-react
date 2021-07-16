import { Button, Flex, Image, Text, useQuery } from '@chakra-ui/react';
import React from 'react';

const getPokemonById = async (test: any, url: any) => {
  console.log(test, url);
  try {
    const pokemon = await (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    return pokemon;
  } catch (err) {
    console.error(err);
  }
};

export default function PokemonCard({ pokemon }: any) {
  console.log(pokemon);
  const { url } = pokemon;
  const {
    data: pokemonInfo,
    isLoading,
    isError,
  }: any = useQuery(['pokemon', url], () => getPokemonById(url));

  if (isError) return <Text>error</Text>;
  if (isLoading) return <Text>loading..</Text>;

  return (
    <Flex
      h="400px"
      w="280px"
      borderRadius="1px"
      borderColor="white"
      direction="column"
      justify="center"
      align="center"
    >
      <Image />
      <Text color="white">name</Text>
      <Button>View</Button>
    </Flex>
  );
}
