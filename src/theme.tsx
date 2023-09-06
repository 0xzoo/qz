import { 
    extendTheme,
    type ThemeConfig,
    // type StyleFunctionProps,
} from '@chakra-ui/react';
// import { mode } from '@chakra-ui/theme-tools';
// import {
//   ChakraBaseProvider,
//   extendBaseTheme,
//   ColorModeScript,
// } from '@chakra-ui/react';
// import chakraTheme from '@chakra-ui/theme';

// const { 
//   Button,
//   Tabs,
//   Alert,
//   Spinner,
//   Toast,
//   Drawer,
//   Modal,
//   Avatar,
//   Card,
//   Divider,
//   Breadcrumb,
//   Link,
//   LinkBox,
//   LinkOverlay,
//   Checkbox,
//   FormControl,
//   IconButton,
//   Input,
//   Radio,
//   Switch,
//   Textarea,
//   Text,
//   Fade, Slide, SlideFade, Collapse,
//   CloseButton,
//   Portal,
// } = chakraTheme.components;

// const theme = extendBaseTheme({
//   components: {
//     Button,
//     Tabs,
//     Alert,
//     Spinner,
//     Toast,
//     Drawer,
//     Modal,
//     Avatar,
//     Card,
//     Divider,
//     Breadcrumb,
//     Link,
//     LinkBox,
//     LinkOverlay,
//     Checkbox,
//     FormControl,
//     IconButton,
//     Input,
//     Radio,
//     Switch,
//     Textarea,
//     Text,
//     Fade, Slide, SlideFade, Collapse,
//     CloseButton,
//     Portal,
//   },
// });

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const overrides = {
  styles: {
    global: () => ({
      body: {
        fontFamily: 'body',
        // color: mode('gray.800', 'whiteAlpha.900')(props),
        // bg: mode('white', 'gray.800')(props),
        // lineHeight: 'base',
        height: '100vh',
        width: '100vw',
      },
    }),
    fonts: {
      body: "Libre Franklin, sans-serif",
      heading: "Libre Franklin, serif",
      // tabs: "Poppins, sans-serif"
    },
  },
  config,
};

export const theme = extendTheme(overrides);
