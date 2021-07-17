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
import { useSearchStore } from '../../store/search-store';

export default function SearchSection() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  return (
    <Flex w="100%" align="center" direction="column">
      <Heading color="white" mb={4}>
        Search for any pokemon.
      </Heading>
      <InputGroup
        position="sticky"
        top={0}
        zIndex={3}
        w={{ sm: '90vw', md: '70%', lg: '40vw' }}
        bg="brand.text"
        rounded="md"
      >
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
