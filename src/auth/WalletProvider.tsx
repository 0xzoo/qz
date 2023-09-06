import React, { createContext, useState, useCallback, useMemo } from 'react'
import { usePolybase, useAuth } from '@polybase/react'
import { useLogin } from './useLogin'
// import { ethPersonalSign } from '@polybase/eth'

export interface WalletContextValue {
  publicKey: string | undefined
  login: () => void
  logout: () => void
  forceSigning: () => void
  loggedInWWallet: boolean
}

export const WalletContext = createContext<WalletContextValue>({
  publicKey: undefined,
  login: () => {},
  logout: () => {},
  forceSigning: () => {},
  loggedInWWallet: false,
})

export interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider ({ children }: WalletProviderProps) {
  const [loggedInWWallet, setLoggedInWWallet] = useState<boolean>(false)
  const [publicKey, setPublicKey] = useState<WalletContextValue['publicKey']>()
  const polybase = usePolybase()
  const {auth} = useAuth()

  const login = useCallback(async () => {
    if (!loggedInWWallet) logout()
    const pk = await useLogin(auth, polybase).catch((e) => {throw e})

    setPublicKey(pk)
    setLoggedInWWallet(true)
    if (!pk) console.log('should not be logged in')
  }, [])

  const logout = useCallback(async () => {
    console.log('logging out')
    setPublicKey(undefined)

    await auth.signOut()
    setLoggedInWWallet(false)
  }, [publicKey])
  
  const forceSigning = () => {
    // if (privateKey) {
    //   polybase.signer(async (data: string) => {
    //     return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
    //   })
    // } 
    // else {
    //   login()
    // }
  }

  const value = useMemo(() => ({
    publicKey,
    login,
    logout,
    forceSigning,
    loggedInWWallet
  }), [publicKey, loggedInWWallet])

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}