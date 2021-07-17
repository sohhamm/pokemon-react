import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import React from 'react';

const getPokemonById = async (url: string) => {
  // const [_key, url] = queryKey;
  // console.log(_key, url);
  try {
    const pokemon = await (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    return pokemon;
  } catch (err) {
    console.error(err);
    throw new Error('failed to fetch pokemon data');
  }
};

export default function PokemonCard({ pokemon }: any) {
  const { url, name } = pokemon;
  const {
    data: pokemonInfo,
    isLoading,
    isError,
  }: any = useQuery(['pokemon', url], () => getPokemonById(url));

  console.log(pokemonInfo);

  if (isError) return <Text>error</Text>;
  if (isLoading) return <Text>loading..</Text>;

  return (
    <Flex
      h="400px"
      w="280px"
      borderRadius="1px"
      borderColor="red"
      direction="column"
      justify="center"
      align="center"
    >
      <Image
        src={
          pokemonInfo.sprites.other['official-artwork'].front_default ??
          pokemonInfo.sprites.other.dream_world.front_default
        }
        boxSize={200}
      />
      <Text color="white" fontWeight="semibold">
        {name[0].toUpperCase() + name.slice(1, name.length + 1)}
      </Text>
      <Button bg="#3368B1" color="white" size="lg">
        View
      </Button>
    </Flex>
  );
}
