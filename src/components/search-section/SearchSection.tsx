import { Flex, Input } from '@chakra-ui/react';
import React from 'react';

export default function SearchSection() {
  return (
    <Flex w="100%" justify="center">
      <Input type="text" w="50vw" />
    </Flex>
  );
}
