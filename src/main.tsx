import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ChakraProvider,
  // extendBaseTheme,
  ColorModeScript,
} from '@chakra-ui/react';
// import { 
//   ChakraBaseProvider,
//   extendBaseTheme,
//   ColorModeScript,
// } from '@chakra-ui/react';
import { theme } from './theme';
import App from './App.tsx';
// import './index.css';
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
// })


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='dark' />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
