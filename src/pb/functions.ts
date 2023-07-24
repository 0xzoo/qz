import { Polybase } from "@polybase/client"

const polybase = new Polybase({ defaultNamespace: "pk/0x4d5de3518af7848d4997a0749bcdfa49582ba156231afdb227818cf802dc597d593c0faa1604eaa2e0ac3867555cf07fe0c902e1b7893cd7a9b3feb0e4bd1489/Qz4" })

const collectionReference = polybase.collection("Az")

export async function listAzToQ (qId: string) {
  console.log(qId)
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