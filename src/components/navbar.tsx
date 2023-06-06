import React from "react";
import { 
  Box,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar
} from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";

type logoProps = {
  w: string;
  // h?: string;
  color: string;
};

// type navBarContainerProps = {
  
// };

type navBarProps = {
  isLoggedIn: boolean;
  // signIn : React.Dispatch<React.SetStateAction<string>>
  // signIn: (e: React.MouseEventHandler<HTMLDivElement>) => void;
  signIn: any;
};

const Logo = ({...logoProps}: logoProps) => {
  return (
    <Box {...logoProps}>
      <Heading fontSize="lg" fontWeight="bold">
        Qz
      </Heading>
    </Box>
  )
};

const NavBarContainer = () => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      // {...props}
    >
    </Flex>
  )
};

export const NavBar = ({isLoggedIn, signIn}: navBarProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = () => {
    setIsOpen(!isOpen);
    signIn();
  };

  return (
    <NavBarContainer>
      <Logo
        w="100px"
        color={"white"}
      />
      {isLoggedIn ? (
        <Menu>
          <MenuButton as={Avatar}>
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem>My Qz</MenuItem>
            <MenuItem>My Az</MenuItem>
          </MenuList>
        </Menu>
      ):(
        <Button onClick={() => toggle()}>Login with Wallet</Button>
      )}
    </NavBarContainer>
  )
};