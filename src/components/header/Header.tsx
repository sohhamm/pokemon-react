import * as React from 'react';
import {
  Input,
  Flex,
  Heading,
  InputGroup,
  Icon,
  InputRightElement,
  background,
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';

export default function Header() {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      bg="brand.default"
      p={2}
    >
      <Heading as="h2" color="white">
        Search for any pokemon.
      </Heading>
      <InputGroup w="45%" my={4}>
        <Input
          variant="filled"
          colorScheme="brand.y"
          bg="brand.y"
          _hover={{
            bg: 'brand.y',
          }}
          _focus={{
            bg: 'brand.y',
          }}
        />
        <InputRightElement
          children={
            <>
              <Icon as={FiFilter} />
              <Icon as={MdSearch} w={5} h={5} mx={1} />
            </>
          }
        />
      </InputGroup>
    </Flex>
  );
}
