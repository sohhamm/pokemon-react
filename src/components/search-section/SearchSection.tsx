import {
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import { MdSearch } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';

export default function SearchSection() {
  return (
    <Flex w="100%" align="center" direction="column">
      <Heading color="white" mb={4}>
        Search for any pokemon.
      </Heading>
      <InputGroup w="40vw" position="sticky" bg="brand.text" rounded="md">
        <Input type="text" />
        <InputRightElement mr={8}>
          <Icon as={FiFilter} color="brand.bg" boxSize={5} />
        </InputRightElement>
        <InputRightElement>
          <Icon as={MdSearch} color="brand.bg" boxSize={6} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
}
