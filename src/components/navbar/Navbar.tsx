import * as React from 'react';
import { Flex, Text } from '@chakra-ui/react';

export default function Navbar() {
  return (
    <Flex
      align="center"
      justify="space-between"
      bg="brand.default"
      h={16}
      w="100%"
      pl={4}
    >
      <Text color="#FFCB05">Pokedex</Text>
    </Flex>
  );
}
