import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { ChevronDownIcon, ViewIcon } from '@chakra-ui/icons'

type PrivacyDropdownProps = {
  onChange: (s: string) => void
  value: string
}

const options = [
  'Only Me',
  'My Followers',
  'Allowlist',
  'Everyone',
  'Anon'
]

export const PrivacyDropdown = (props: PrivacyDropdownProps) => {

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant={'unstyled'}
      >
        <ViewIcon mr={2} /> {props.value}
      </MenuButton>
      <MenuList>
        {options.map((o, i) => (
          <MenuItem
            onClick={() => props.onChange(o)}
            key={i}
            color={o == props.value ? 'linkedin.600': ''}
          >
            {o}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}