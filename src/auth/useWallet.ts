import { useContext } from 'react'
import { WalletContext } from './WalletProvider'

export function useWallet() {
  return useContext(WalletContext)
}
