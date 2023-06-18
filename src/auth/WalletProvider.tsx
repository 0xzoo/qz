import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import { usePolybase } from '@polybase/react'
import { auth } from './useLogin'
import { useLogin } from './useLogin'
import { ethPersonalSign } from '@polybase/eth'

export interface WalletContextValue {
  privateKey: string | null
  publicKey: string | null
  login: () => void
  logout: () => void
  skipSigning: () => void
  reinforceSigning: () => void
}

export const WalletContext = createContext<WalletContextValue>({
  privateKey: null,
  publicKey: null,
  login: () => {},
  logout: () => {},
  skipSigning: () => {},
  reinforceSigning: () => {}
})

export interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [privateKey, setPrivateKey] = useState<WalletContextValue['privateKey']>(null)
  const [publicKey, setPublicKey] = useState<WalletContextValue['publicKey']>(null)
  const polybase = usePolybase()

  const login = useCallback(async () => {
    const wallet = await useLogin()
    setPrivateKey(wallet.privateKey)
    setPublicKey(wallet.publicKey)
  }, [])

  const logout = useCallback(async () => {
    setPrivateKey(null)
    setPublicKey(null)

    await auth.signOut()
  }, [])

  const skipSigning = useCallback(() => {
    polybase.signer(async (data: string) => {
      return null
    })
  }, [])
  
  const reinforceSigning = () => {
    if (privateKey) {
      polybase.signer(async (data: string) => {
        return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
      })
    } 
    // else {
    //   login()
    // }
  }

  const value = useMemo(() => ({
    privateKey,
    publicKey,
    login,
    logout,
    skipSigning,
    reinforceSigning
  }), [publicKey, privateKey])

  return (
    <WalletContext.Provider value={value}
    >
      {children}
    </WalletContext.Provider>
  )
}