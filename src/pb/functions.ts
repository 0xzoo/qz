import { polybase } from "../App"
import {
  CollectionRecordResponse,
  CollectionList
} from "@polybase/client"
import {
  User,
  Qz,
  Az
} from '../types/types'
// import { Auth } from "@polybase/auth" 

export async function listAzToQ (qId: string) {
  const collectionReference = polybase.collection("Az")
  const collectionRecord = collectionReference.record(qId)
  const records: any = await collectionReference
    .where("qId", "==", collectionRecord)
    .sort('timestamp', 'desc')
    .get().catch((e) => console.log(e))

  // // Array of records is available under the data property
  const { data } = records

  // Records is QueryResponse, so we can use it to get the next page of results
  // await records.next()

  return data
  // return { data, cursor }
}


export async function getUser (id: string) {
  const record: CollectionRecordResponse<User, User> = await polybase.collection('User').record(id).get().catch((e) => {throw e})
  return record
}

export async function getQ (qId: string) {
  const record: CollectionRecordResponse<Qz, Qz> = await polybase.collection("Qz").record(qId).get().catch((e) => {throw e})
  // const { data: currentQData } = record
  return record
}

// // wtf is this smh
// export async function getQueue (qz?: CollectionRecordResponse<Qz, Qz>[]) {
//   let queueData
//   if (qz) {
//     queueData = qz
//   } else {
//     const records: CollectionList<Qz> = await polybase.collection("Qz").sort('timestamp', 'desc').get()
//     const { data: currentQueueData } = records
//     queueData = currentQueueData
//   }
//   console.log(queueData)
//   return queueData
// }

export async function getNewQz () {
  const records: CollectionList<Qz> = await polybase.collection("Qz").sort('timestamp', 'desc').get()
  const { data: currentQueueData } = records

  console.log(currentQueueData)
  return currentQueueData
}

export async function getPriorAz (qId: string, userId?: string) {
  if (userId) {
    const records: CollectionList<Az> = await polybase.collection("PubAz")
      .where('qId', '==', polybase.collection("Qz").record(qId))
      .where('owner', '==', polybase.collection("User").record(userId))
      .sort('timestamp', 'desc')
      .get()
    let { data: priorAzData } = records

    const privateRecords: CollectionList<Az> = await polybase.collection("PrivAz")
      .where('qId', '==', polybase.collection("Qz").record(qId))
      .where('owner', '==', polybase.collection("User").record(userId))
      .sort('timestamp', 'desc')
      .get()
    const { data: priorPrivateAzData } = privateRecords
    if (priorPrivateAzData.length) {
      console.log('priorPrivateAzData', priorPrivateAzData)
      priorAzData.push(...priorPrivateAzData)
    }
    return priorAzData
  } else {
    return []
  }
}

export async function getUserAz (userId: string) {
  // const auth = new Auth()
  // polybase.signer(async () => {
  //   return {
  //     h: 'eth-personal-sign',
  //     sig: await auth.ethPersonalSign('Confirm')
  //   }
  // })

  const records: CollectionList<Az> = await polybase.collection("PubAz")
    .where('owner', '==', polybase.collection("User").record(userId))
    .sort('timestamp', 'desc')
    .get()
  let { data: priorAzData } = records

  const privateRecords: CollectionList<Az> = await polybase.collection("PrivAz")
    .where('owner', '==', polybase.collection("User").record(userId))
    .sort('timestamp', 'desc')
    .get()
  const { data: priorPrivateAzData } = privateRecords
  if (priorPrivateAzData.length) {
    console.log('priorPrivateAzData', priorPrivateAzData)
    priorAzData.push(...priorPrivateAzData)
  }
  return priorAzData
}

const chooseCollection = (audience: string) => {
  const privAzAudiences = ['Only Me', 'My Followers', 'Allowlist']
  const aCollection = privAzAudiences.includes(audience)
    ? 'PrivAz'
    : 'PubAz'

  return aCollection
}

export async function createNewA (a: any, audience: string, allowlist?: User[]) {
  let newA
  const aCollection = chooseCollection(audience)
  if (aCollection == 'PrivAz') {
    if (!allowlist) allowlist = [a[4]]
    newA = [
      a[0],
      a[4],
      a[1],
      a[2],
      ...a.slice(-4),
      allowlist
    ]
  } else {
    newA = a
  }
  await polybase.collection(aCollection).create(newA).catch((e) => {throw e})
}

export async function markAEdited(aId: string, audience: string) {
  const aCollection = chooseCollection(audience)
  const edited = await polybase.collection(aCollection).record(aId).call("markAEdited", [aId]).catch((e) => {throw e})
  console.log(edited)
}

// async function makePublicOrPrivate
// destroy priorA?

async function incrPubAz(qId: string) {
  await polybase.collection('Qz').record(qId).call("incrPubAz", [qId]).catch((e) => {throw e})
}

async function incrPrivAz(qId: string) {
  await polybase.collection('Qz').record(qId).call("incrPrivAz", [qId]).catch((e) => {throw e})
}

export async function incrAz(qId: string, audience: string) {
  const aCollection = chooseCollection(audience)
  aCollection == 'PubAz' ? incrPubAz(qId) : incrPrivAz(qId)
}
