// import {
//   ChakraBaseProvider,
//   extendBaseTheme,
//   ColorModeScript,
// } from '@chakra-ui/react';
// import chakraTheme from '@chakra-ui/theme';
// import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { PolybaseProvider } from "@polybase/react";
import { Polybase } from "@polybase/client";
import { AppRoutes } from './AppRoutes';

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

const polybase = new Polybase();

const App = () => (
  
      <BrowserRouter>
        <PolybaseProvider polybase={polybase}>

          <AppRoutes />

        </PolybaseProvider>
      </BrowserRouter>
);

export default App;