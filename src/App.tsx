import { PolybaseProvider, AuthProvider } from "@polybase/react"
import { Polybase } from "@polybase/client"
import { Auth } from "@polybase/auth"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { WalletProvider } from "./auth/WalletProvider"
// import Root, { loader as rootLoader } from './routes/Root'
import Root from './routes/Root'
import { Home } from "./routes/Home"
// import { Qz } from './routes/Qz'
import { Profile } from "./routes/Profile"

export const polybase = new Polybase({   defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/Qz_a" });
const auth = new Auth()

const router = createBrowserRouter([
  { path: "/",
    element: < Root />,
    // loader: rootLoader,
    children: [
      { 
        index: true, 
        element: <Home />,
      },
      // { 
      //   path: "q/:qId",
      //   element: <Qz />,
      //   id: "Qz",
      //   // loader: async ({ params }) => {
      //   //   return polybase.collection('Qz').record(params.qId as string).get()
      //   // },
      //   // children: [
      //   //   {
      //   //     path: ":qId", 
      //   //     element: <QA />,
      //   //   }
      //   // ]
      // },
      {
        path: ":userId",
        element: <Profile />,
        id: "User Profile",
        // loader: async ({ params }) => {
        //   return polybase.collection('Users').record(params.userId as string).get()
        // }
        //   let url = new URL(request.url)
        //   let searchTerm = url.searchParams.get("q")
        //   return fakeSearchProducts(searchTerm)
        // },
        // children: [
        //   {
        //     path: "qz",
        //     element: <QzList />
        //   }
        // ],
      }
    ]
  }
]);

const App = () => (
  <PolybaseProvider polybase={polybase}>
    <AuthProvider auth={auth} polybase={polybase}>
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </AuthProvider>
  </PolybaseProvider>
);

export default App;