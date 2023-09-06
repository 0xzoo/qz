import * as eth from '@polybase/eth'
import { 
  secp256k1,
  encodeToString,
  decodeFromString,
  aescbc,
  EncryptedDataAesCbc256
} from '@polybase/util'
import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'
import { Auth } from '@polybase/react/dist/auth/types'
import { User } from '../types/types'
import { AuthState } from '@polybase/auth'

enum AuthType {
  MM = 'metamask',
  EMAIL = 'email'
}

export const useLogin = async (auth: Auth, polybase: Polybase) => {
  
  // get account via metamask (doesnt work on frame?)
  const authState = await auth.signIn({force: true}).catch((e) => { throw e })
  if (authState == null) throw 'err' // !fix give error

  const wallet = await getWallet(authState, polybase).catch((e) => {throw e})
  if (!wallet.publicKey) {
    auth.signOut()
    return
  }

  // Update the signer
  polybase.signer(async (data: string) => {
    return authState.type == AuthType.EMAIL ?
      { h: 'eth-personal-sign', sig: ethPersonalSign(wallet.privateKey, data) }
    : null
  })

  return wallet.publicKey
}

const getWallet = async (authState: AuthState, polybase: Polybase) => {
  // consts
  const { type, email, userId } = authState
  const account = type == AuthType.EMAIL ? authState.publicKey as string : userId as string
  const accountToUintArray = decodeFromString(account, 'utf8')
  const aSlice = accountToUintArray.slice(98)
  // Lookup account
  const user = await getUser(userId as string, polybase).catch((e) => {throw e})

  //
  ////// if user exists, decrypt private key
  if (user && user.exists()) {
    const encryptedPrivateKey = user.data?.wpvKey as string
    const publicKey = user.data?.wpbKey as string
    let privateKey: string

    //// mm
    if (type == AuthType.MM) {
      privateKey = await eth.decrypt(encryptedPrivateKey, account).catch((e) => {throw e})
      return { privateKey, publicKey }

    //// email
    } else {
      // divvy base nonce and decode
      const encryptedPrivateKeyBase = decodeFromString(encryptedPrivateKey.slice(0,98), 'hex')
      const encryptedPrivateKeyNonce = decodeFromString(encryptedPrivateKey.slice(98), 'hex')
      const encryptedPrivateKeyVersion: EncryptedDataAesCbc256["version"] = 'aes-cbc-256/symmetric'

      // aes decrypt
      const encryptedData: EncryptedDataAesCbc256 = {
        ciphertext: encryptedPrivateKeyBase,
        nonce: encryptedPrivateKeyNonce,
        version: encryptedPrivateKeyVersion
      }
      const privateKeyBuff = await aescbc.symmetricDecrypt(aSlice, encryptedData).catch((e) => {throw e}) as Uint8Array
      privateKey = encodeToString(privateKeyBuff, 'hex')

      return { privateKey, publicKey }
    }
  ////// otherwise create new user with wallet
  } else {
    const col = polybase.collection<User>('User')
    const timestamp = Date.now()

    //// generate keys
    const privateKeyBuff = secp256k1.generatePrivateKey()
    const privateKey = encodeToString(privateKeyBuff, 'hex')
    const publicKey = encodeToString(secp256k1.getPublicKey64(privateKeyBuff), 'hex')
    let encryptedPrivateKey: string

    //// if mm (request to use eth pvk to encrypt)
    if (type == AuthType.MM) {
      encryptedPrivateKey = await eth.encrypt(privateKey, account).catch((e => {throw e}))

      //// create user account
      await col.create([userId as string, publicKey, encryptedPrivateKey, timestamp]).catch((e) => {throw e})
      
    //// if email
    } else if (type == AuthType.EMAIL) {
      // aes encrypt
      const encryptedPrivateKeyAes = await aescbc.symmetricEncrypt(aSlice, privateKeyBuff)
      // stringify base, nonce
      const encryptedPrivateKeyBase = encodeToString(encryptedPrivateKeyAes.ciphertext, 'hex')
      const encryptedPrivateKeyNonce = encodeToString(encryptedPrivateKeyAes.nonce, 'hex')
      // join base nonce into one string
      encryptedPrivateKey = encryptedPrivateKeyBase + encryptedPrivateKeyNonce

      //// create user account
      await col.create([userId as string, publicKey, encryptedPrivateKey, timestamp, email as string]).catch((e) => {throw e})
    }

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

const getUser = async (account: string, polybase: Polybase) => {
  const col = polybase.collection<User>('User')
  const doc = col.record(account)
  const user = await doc.get().catch(() => null).catch((e) => {throw e})
  return user
}

// export const getPublicKey = async (account: string) => {
//   const user = await getUser(account)
//   const publicKey = user && user.data?.publicKey
//   return publicKey
// }