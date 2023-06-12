import { Auth } from '@polybase/auth'
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { secp256k1 } from '@polybase/util'
import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { useEffect, useState } from 'react'
import { Outlet, useOutletContext } from "react-router-dom"
import { Flex } from '@chakra-ui/react'
import { NavBar } from '../components/navbar'
// import { LoaderFunction } from 'react-router-dom';

// export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never;

// export const loader = (async () => {
// 	return db
// }) satisfies LoaderFunction;

// innit db
const db = new Polybase({ defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/QzTest" })

// Auth
const auth = new Auth();

export async function getPublicKey() {
  const msg = 'Login to Qz'
  const sig = await auth.ethPersonalSign(msg)
  const publicKey = ethPersonalSignRecoverPublicKey(sig, msg)
  return '0x' + publicKey.slice(4)
}

async function createWallet() {
  const { privateKey, publicKey } = await secp256k1.generateKeyPair()

  db.signer(async (data: string) => {
    return { 
      h: 'eth-personal-sign', 
      sig: ethPersonalSign(privateKey, data) }
  })

  return { privateKey, publicKey }
}

export default function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [account, setAccount] = useState(auth.state)

  // Handle signIn
  const signIn = async () => {
    const res = await auth.signIn()

    let publicKey = res?.publicKey

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
      const user = await db.collection('User').record(publicKey).get()
      if (!user.exists()) db.collection('User').create([])
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
      setAccount(authState)
      // console.log('account', account)

      db.signer(async (data: string) => {
        return {
          h: 'eth-personal-sign',
          sig: await auth.ethPersonalSign(data),
        }
      })
    })
  })

  return (
    <Flex direction={'column'} h='100vh'>
      <NavBar signIn={signIn} signOut={signOut} isLoggedIn={isLoggedIn} />
      <Outlet context={{isLoggedIn, signIn, account, db}}/>
    </Flex>
  )
}

type AuthStateType = {
  type: string
  userId: string
  publicKey: string
}

type ContextType = { 
  isLoggedIn: boolean | null
  signIn: () => void
  account: AuthStateType
  db: Polybase
}

export function useRootContext() {
  return useOutletContext<ContextType>();
}