import React from "react"
import { 
  Box,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Button,
  ButtonGroup,
  IconButton,
  // Avatar,
  Spacer,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react"
import {
  MoonIcon,
  SunIcon,
  HamburgerIcon
} from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
// import { useIsAuthenticated } from "@polybase/react"
import { useWallet } from "../auth/useWallet"

type logoProps = {
  w: string
};

const Logo = ({...logoProps}: logoProps) => {
  return (
    <Box {...logoProps} ml={2}>
      <Image src={useColorModeValue('/thiqq.svg','/thiwqq.svg')} alt='Qz Logo' boxSize={12} />
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
      bgColor={useColorModeValue('#ff0', 'transparent')}
      p={4}
    >
      { children }
    </Flex>
  )
}

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box>
      <IconButton
        aria-label='Change ColorMode'
        onClick={toggleColorMode}
        bg={'transparent'}
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      />
    </Box>
  )
}

export const NavBar = () => {
  // const [ isLoggedIn ] = useIsAuthenticated()
  const [ isOpen, setIsOpen ] = React.useState(false)
  const { login, logout, loggedInWWallet } = useWallet()

  const handleLogin = () => {
    setIsOpen(!isOpen)
    login()
  }

  return (
    <NavBarContainer>
      <Link as={RouterLink} to={'/'} zIndex={2000}>
        <Logo
          w="100px"
        />
      </Link>
      <Spacer />
      <ButtonGroup alignItems={'center'} zIndex={2000}>
        <ColorModeToggle />
        {loggedInWWallet ? (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Menu'
              icon={<HamburgerIcon />}
              bg={'transparent'}
            />
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem>My Qz</MenuItem>
                <MenuItem>My Az</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <Button onClick={() => logout()}>Logout</Button>
            </MenuList>
          </Menu>
        ):(
          <Button onClick={() => handleLogin()}>Login</Button>
        )}
      </ButtonGroup>
    </NavBarContainer>
  )
};