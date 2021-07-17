// import * as React from 'react';

import { Flex, Heading, Image } from '@chakra-ui/react';
import pokeballImg from '../../assets/pokeball.png';

export default function Navbar() {
  return (
    <Flex p="2em" position="sticky" bg="brand.bg" zIndex="2" top="0">
      <Heading color="brand.text">Pokedex</Heading>
      <Image src={pokeballImg} boxSize={50} mb={2} ml={3} />
    </Flex>
  );
}
