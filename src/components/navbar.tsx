import React, { ReactElement } from "react";
import { 
  Box,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Button,
  Avatar
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom'
// import { HamburgerIcon } from "@chakra-ui/icons";

type logoProps = {
  w: string;
  // h?: string;
  color: string;
};

// type navBarContainerProps = {
//   children: ReactElement;
// };

type navBarProps = {
  isLoggedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const Logo = ({...logoProps}: logoProps) => {
  return (
    <Box {...logoProps}>
      <Heading as="h1">
        Qz
      </Heading>
    </Box>
  )
};

const NavBarContainer = ({ children }: any) => { // fix! type dec
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
    >
      { children }
    </Flex>
  )
};

export const NavBar = ({isLoggedIn, signIn, signOut}: navBarProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = () => {
    setIsOpen(!isOpen);
    signIn();
  };

  return (
    <NavBarContainer>
      <Link as={RouterLink} to={'/'}>
        <Logo
          w="100px"
          color={"white"}
        />
      </Link>
      {isLoggedIn ? (
        <Menu>
          <MenuButton as={Avatar} />
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem>My Qz</MenuItem>
              <MenuItem>My Az</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <Button onClick={() => signOut()}>Logout</Button>
          </MenuList>
        </Menu>
      ):(
        <Button onClick={() => toggle()}>Login</Button>
      )}
    </NavBarContainer>
  )
};