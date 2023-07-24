import * as eth from '@polybase/eth'
import { secp256k1, encodeToString } from '@polybase/util'
import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { Auth } from '@polybase/auth'
import { User } from '../types/types'

// Auth to use for everything
export const auth = new Auth()
const polybase = new Polybase({ defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/Qz4" });

export const useLogin = async () => {
  // get account via metamask (doesnt work on frame?)
  const accounts = await eth.requestAccounts()
  const account = accounts[0]
  const wallet = await getWallet(account)

  // Update the signer
  polybase.signer(async (data: string) => {
    return { h: 'eth-personal-sign', sig: ethPersonalSign(wallet.privateKey, data) }
  })

  await auth.signIn().catch((e) => {throw e})
  return wallet
}

export const getWallet = async (account: string) => {
  // Lookup account
  const col = polybase.collection<User>('User')
  const doc = col.record(account)
  const user = await getUser(account)

  // if user exists, get private key and decrypt
  if (user && user.exists()) {
    const encryptedPrivateKey = user.data?.wpvKey as string
    const privateKey = await eth.decrypt(encryptedPrivateKey, account)
    const publicKey = user.data?.wpbKey as string
    return { privateKey, publicKey }
  // otherwise create new user wallet
  } else {
    // Generate keys
    const wallet = await secp256k1.generateKeyPair()
    const privateKeyBuff = wallet.privateKey
    const privateKey = encodeToString( privateKeyBuff, 'hex')
    const encryptedPrivateKey = await eth.encrypt(privateKey, account)
    const publicKey = encodeToString( wallet.publicKey, 'hex')

    polybase.signer(async (data: string) => {
      return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
    })

    await col.create([account, publicKey, encryptedPrivateKey]).catch((e) => {
      console.error(e)
      throw e
    })

    return { privateKey, publicKey }
  }
}

// export const skipSigning = () => {
//   polybase.signer(async (data: string) => {
//     return null
//   })
// }

// export const reinforceSigning = (pk) => {
//   polybase.signer(async (data: string) => {
//     return { h: 'eth-personal-sign', sig: ethPersonalSign(pk, data) }
//   })
// }

const getUser = async (account: string) => {
  const col = polybase.collection<User>('User')
  const doc = col.record(account)
  const user = await doc.get().catch(() => null)
  return user
}

export const getPublicKey = async (account: string) => {
  const user = await getUser(account)
  const publicKey = user && user.data?.publicKey
  return publicKey
}