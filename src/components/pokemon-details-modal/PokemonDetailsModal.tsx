// import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Image,
  Heading,
} from '@chakra-ui/react';

type PropTypes = {
  pokemonInfo: any;
  isOpen: boolean;
  onClose: () => void;
};

const modalColor: any = {
  normal: '#666666',
  fighting: '#d73f16',
  flying: '#afb4d6',
  poison: '#63458b',
  ground: '#5c391a',
  rock: '#46280c',
  bug: '#728371',
  ghost: '#e6e5f6',
  steel: '#565759',
  fire: '#c11e2a',
  water: '#2a8ccb',
  grass: '#4fb359',
  electric: '#eae42e',
  psychic: '#c8297c',
  ice: '#b6e8f7',
  dragon: '#f69127',
  dark: '#090807',
  fairy: '#f6cfde',
  unknown: '#ffffff',
  shadow: '#0a0d0b',
};

export default function PokemonDetailsModal({
  pokemonInfo,
  isOpen,
  onClose,
}: PropTypes) {
  const { types } = pokemonInfo;
  //   console.log(types[0].type.name);
  console.log(modalColor[types[0].type.name]);

  //   const typeRef = React.useRef(types.length);
  //   const typeColorRef = React.useRef(types);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg={
          types.length === 1 ? String(modalColor[types[0].type.name]) : 'white'
        }
        bgGradient={
          types.length === 2
            ? `linear(to-r, ${String(modalColor[types[0].type.name])}, ${String(
                modalColor[types[1].type.name]
              )})`
            : 'white'
        }
        // bg="#0000FF"
      >
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Image
              src={
                pokemonInfo.sprites.other['official-artwork'].front_default ??
                pokemonInfo.sprites.other.dream_world.front_default
              }
            />
          </Flex>
          <Flex direction="column">
            <Heading>{pokemonInfo.name}</Heading>
            random stats
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
