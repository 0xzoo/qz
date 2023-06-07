import { Auth } from '@polybase/auth'
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { Polybase, PolybaseConfig } from '@polybase/client'
import { useEffect, useState } from 'react'
import { Outlet, useOutletContext } from "react-router-dom"
import { Flex } from '@chakra-ui/react'
import { NavBar } from '../components/navbar'
// import { LoaderFunction } from 'react-router-dom';

// export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never;

// innit db
const db = new Polybase({ defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/Qz"})

// export const loader = (async () => {
// 	return db
// }) satisfies LoaderFunction;

// Auth
const auth = new Auth();

async function getPublicKey() {
  const msg = 'Login to Qz'
  const sig = await auth.ethPersonalSign(msg)
  const publicKey = ethPersonalSignRecoverPublicKey(sig, msg)
  return '0x' + publicKey.slice(4)
}

export default function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Handle signIn
  const signIn = async () => {
    const res = await auth.signIn()

    let publicKey = res.publicKey

    if (!publicKey) {
      publicKey = await getPublicKey();
    }

    db.signer(async (data: string) => {
      return {
        h: 'eth-personal-sign',
        sig: await auth.ethPersonalSign(data),
      }
    })

    // Create user if it doesn't exist
    try {
      const user = await db.collection('User').record(publicKey).get();
      console.log('User', user);
    } catch (e) {
      await db.collection('User').create([]);
    }

    setIsLoggedIn(!!res)
  }

  // Handle signOut
  const signOut = async () => {
    const res = await auth.signOut()

    setIsLoggedIn(!!res)
  }

  useEffect(() => {
    auth.onAuthUpdate((authState) => {
      setIsLoggedIn(!!authState)

      db.signer(async (data: string) => {
        return {
          h: 'eth-personal-sign',
          sig: await auth.ethPersonalSign(data),
        }
      })
    })
  })

  return (
    <Flex direction={'column'}>
      <NavBar signIn={signIn} signOut={signOut} isLoggedIn={isLoggedIn} />
      <Outlet context={{isLoggedIn}}/>
    </Flex>
  )
}

type ContextType = { isLoggedIn: boolean | null };

export function useIsLoggedIn() {
  return useOutletContext<ContextType>();
}