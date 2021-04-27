import * as React from 'react';
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Text,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FaAngleDown } from 'react-icons/fa';
export default function Navbar() {
  return (
    <Flex align="center" justify="space-between">
      <Text>logo</Text>
      <Menu>
        <MenuButton as={Button} rightIcon={<Icon as={FaAngleDown} />}>
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>Download</MenuItem>
          <MenuItem>Create a Copy</MenuItem>
          <MenuItem>Mark as Draft</MenuItem>
          <MenuItem>Delete</MenuItem>
          <MenuItem>Attend a Workshop</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
