import React from "react"
import { 
  Box,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  ButtonGroup,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react"
import {
  MoonIcon,
  SunIcon,
  HamburgerIcon
} from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
// import { useIsAuthenticated } from "@polybase/react"
import { useWallet } from "../auth/useWallet"
import { useAuth } from "@polybase/react"

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
  const { state } = useAuth()
  const [ isOpen, setIsOpen ] = React.useState(false)
  const { login, logout, loggedInWWallet } = useWallet()
  const navigate = useNavigate()

  const handleLogin = () => {
    setIsOpen(!isOpen)
    login()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
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
              <Link as={RouterLink} to={state?.userId as string}>
                <MenuItem>
                  Profile
                </MenuItem>
              </Link>
              <MenuItem>My Qz</MenuItem>
              <MenuItem>My Az</MenuItem>
              <MenuDivider />
              <MenuItem

                onClick={() => handleLogout()}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ):(
          <Button onClick={() => handleLogin()}>Login</Button>
        )}
      </ButtonGroup>
    </NavBarContainer>
  )
};