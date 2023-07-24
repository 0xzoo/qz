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
  publicKey: string; // eth wallet publicKey as PublicKey 
  wpbKey: string; // indapp wallet publicKey as hex
  wpvKey: string; // indapp wallet privateKey as encrypted hex
  tokenBalance: number; // indapp token balance
  name?: string;
  desc?: string;
  twitter?: string;
}

export interface Owner {
  collectionId: string;
  id: string;
}

export interface Qz {
  id: string;
  owner: Owner;
  stem: string;
  type: string;
  timestamp: number;
  numAz: number;
  az?: string[];
  importance?: number;
  tags?: string[];
  order?: number;
  required?: boolean;
  assets?: string[];
  parent? : string;
}

export type QType = [
  id: string,
  owner: User,
  stem: string,
  type: string,
  timestamp: number,
  numAz: number,
  az?: string[],
  importance?: number,
  tags?: string[],
  order?: number,
  required?: boolean,
  assets?: string[]
]

export interface Az {
  id: string;
  owner: User;
  qId: Qz;
  qIndex?: number;
  value?: string;
  timestamp: number;
  isPrivate: boolean;
  edited: boolean;
  importance?: number;
  asset?: string;
}

export     type AType = [
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