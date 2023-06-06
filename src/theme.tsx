import { 
    extendTheme,
    type ThemeConfig,
    type StyleFunctionProps,
} from '@chakra-ui/react';
// import { mode } from '@chakra-ui/theme-tools';


const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const overrides = {
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        // fontFamily: 'body',
        // color: mode('gray.800', 'whiteAlpha.900')(props),
        // bg: mode('white', 'gray.800')(props),
        // lineHeight: 'base',
        height: '100vh',
        width: '100vw',
      },
    }),
    fonts: {
      body: "system-ui, sans-serif",
      heading: "Josefin Sans, sans-serif",
    },
  },
  config,
};

export const theme = extendTheme(overrides);
