import { CollectionRecordResponse } from "@polybase/client"

export interface PublicKey {
  alg: string
  crv: string
  kty: string
  use: string
  x: string
  y: string
}

export interface User {
  id: string // eth wallet publicKey as hex
  publicKey: string // eth wallet publicKey as PublicKey 
  wpbKey: string // indapp wallet publicKey as hex
  wpvKey: string // indapp wallet privateKey as encrypted hex
  tokenBalance: number // indapp token balance
  createdAt: number // timestamp
  // userName: string // 
  name?: string
  desc?: string
  twitter?: string
  email?: string
}

export interface Owner {
  collectionId: string;
  id: string;
}

export interface Qz {
  id: string;
  stem: string;
  type: string;
  timestamp: number;
  pubAz: number;
  prvAz: number;
  forks: string[];
  followUps: string[];
  anon: boolean;
  owner?: User;
  parent?: string;
  az?: string[];
  importance?: number;
  tags?: string[];
  order?: number;
  required?: boolean;
  assets?: string[];
  childType?: string;
}

export enum qzType {
  mc ='mc',
  text = 'text',
  rank = 'ranking'
}

export interface Az {
  id: string;
  qId: Qz;
  timestamp: number;
  edited?: boolean;
  anon?: boolean;
  owner?: User;
  qIndex?: number;
  value?: string;
  importance?: number;
  asset?: string;
  allowlist?: string[];
}

export interface PublicAz {
  id: string;
  qId: Qz;
  timestamp: number;
  edited?: boolean;
  anon: boolean;
  owner?: User;
  qIndex?: number;
  value?: string;
  importance?: number;
  asset?: string;
}

export interface GatedAz {
  id: string;
  qId: Qz;
  timestamp: number;
  edited?: boolean;
  owner: User;
  qIndex?: number;
  value?: string;
  importance?: number;
  asset?: string;
  allowlist?: string[];
}

export type NewAToSubmit = [
  id: string,
  currentQ: CollectionRecordResponse<Qz, Qz>,
  timestamp: number,
  anon: boolean,
  user?: CollectionRecordResponse<User, User>,
  qIndex?: number,
  valueOr?: string,
  importance?: number,
  allowlist?: User[]
]

// export type QType = [
//   id: string,
//   owner: User,
//   stem: string,
//   type: string,
//   timestamp: number,
//   numAz: number,
//   az?: string[],
//   importance?: number,
//   tags?: string[],
//   order?: number,
//   required?: boolean,
//   assets?: string[]
// ]

export type AType = [
  id: string,
  owner: Owner,
  qId: {
    collectionId: string,
    id: string
  },
  timestamp: number,
  isPrivate: boolean,
  qIndex?: number | null,
  value?: string | null,
  importance?: number | null,
  asset?: string | null
]

export interface loaderData {
  block: any;
  call: any;
  client: any;
  collection: any;
  data: any;
  exists: any;
  get: any;
  id: string;
  key: any;
  onSnapshot: any;
  onSnapshotRegister: any;
  reference: any;
  request: any;
  toJSON: any;
}

export type QAProps = {
  qIndex: number | undefined
  handleMcRadio: (i: string) => void
  audience: string
  handleAudience: (s: string) => void
  handleImportance: (i: number) => void
  value: string
  handleValue: (s: string) => void
  initialRef: React.MutableRefObject<null>
  currentQ:  Qz,
  userAz: CollectionRecordResponse<Az>[] | undefined
}

export enum QAViews {
  RESPOND = 'Respond',
  PUBLIC = 'PublicAz',
  FORKS = 'Forks',
  FUPS = 'FollowUps'
}

export type QAViewProps = {
  qIndex: number | undefined
  handleMcRadio: (i: string) => void
  value: string
  handleValue: (s: string) => void
  currentQ: Qz
  userAz: CollectionRecordResponse<Az>[] | undefined
  initialRef: React.MutableRefObject<null>
  audience: string
  handleAudience: (s: string) => void
  handleImportance: (i: number) => void
  qAView: QAViews
  handleQAViewChange: (view: QAViews) => void
}

export type responseViewProps = {
  handleMcRadio: (i: string) => void
  value: string | undefined
  handleValue: (s: string) => void
  currentQ: Qz
  userAz: CollectionRecordResponse<Az>[] | undefined
  initialRef: React.MutableRefObject<null>
}

export enum Audiences {
  PRIVATE = 'Only Me',
  FOLLOWERS = 'My Followers',
  ALLOWLIST = 'Allowlist',
  PUBLIC = 'Everyone',
  ANON = 'Anon'
}