import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

type PropTypes = {
  pokemonInfo: any;
  isOpen: boolean;
  onClose: () => void;
};

const modalColor = {
  grass: 'green',
  fire: 'red',
  water: 'blue',
};

export default function PokemonDetailsModal({
  pokemonInfo,
  isOpen,
  onClose,
}: PropTypes) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> {pokemonInfo.name} </ModalHeader>
        <ModalCloseButton />
        <ModalBody>pokemon info</ModalBody>
      </ModalContent>
    </Modal>
  );
}
