import { PolybaseProvider } from "@polybase/react";
import { Polybase } from "@polybase/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import Root, { loader as rootLoader } from './routes/Root';
import Root from './routes/Root';
import { Home } from './routes/Home';
import { Qz } from './components/Qz';
import { Q } from './routes/Q';
// import { A } from './routes/A';


const router = createBrowserRouter([
  { path: "/",
    element: < Root />,
    // loader: rootLoader,
    children: [
      { 
        index: true, 
        element: <Home />,
      },
      { 
        path: "q",
        element: <Qz />,
        children: [
          {
            path: ":qId", 
            element: <Q />,
          }
        ]
      },
    ]
  }
]);

const polybase = new Polybase();

const App = () => (
  <PolybaseProvider polybase={polybase}>
    <RouterProvider router={router} />
  </PolybaseProvider>
);

export default App;