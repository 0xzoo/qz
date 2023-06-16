import * as eth from '@polybase/eth'
import { secp256k1, encodeToString, decodeFromString } from '@polybase/util'
import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { Auth } from '@polybase/auth'
import { User } from '../types/types'

// Auth to use for everything
export const auth = new Auth()
const polybase = new Polybase({ defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/QzTest2" });
// let privateKey: string

export const useLogin = async () => {
  const accounts = await eth.requestAccounts()
  const account = accounts[0]
  const wallet = await getWallet(account, polybase)

  // Update the signer
  polybase.signer(async (data: string) => {
    return { h: 'eth-personal-sign', sig: ethPersonalSign(wallet.privateKey, data) }
  })

  const res = await auth.signIn().catch((e) => {throw e})
}

export const getWallet = async (account: string, db: Polybase) => {
  // Lookup account
  const col = db.collection<User>('User')
  const doc = col.record(account)
  const user = await doc.get().catch(() => null)
  if (!(user && user.exists())) {
    // Generate keys
    const wallet = await secp256k1.generateKeyPair()

    const privateKeyBuff = wallet.privateKey
    const privateKey = encodeToString( privateKeyBuff, 'hex')
    const encryptedPrivateKey = await eth.encrypt(privateKey, account)

    db.signer(async (data: string) => {
      return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
    })

    await col.create([account, encryptedPrivateKey]).catch((e) => {
      console.error(e)
      throw e
    })

    const newUser = await doc.get().catch(() => null) // !fix better way of doing this...
    const publicKey = newUser?.data?.publicKey

    return { privateKey, publicKey }
  } else {

    const encryptedPrivateKey = user.data?.pvKey as string
    const privateKey = await eth.decrypt(encryptedPrivateKey, account)
    const publicKey = user.data?.publicKey as string
    return { privateKey, publicKey }
  }
}

export const skipSigning = () => {
  polybase.signer(async (data: string) => {
    return null
  })
}

// export const reinforceSigning = () => {
//   polybase.signer(async (data: string) => {
//     return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
//   })
// }

export async function getPublicKey() {
  const msg = 'Login to Qz'
  const sig = await auth.ethPersonalSign(msg)
  const publicKey = eth.ethPersonalSignRecoverPublicKey(sig, msg)
  return '0x' + publicKey.slice(4)
}