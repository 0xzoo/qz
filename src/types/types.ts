export interface PublicKey {
  alg: string
  crv: string
  kty: string
  use: string
  x: string
  y: string
}

export interface User {
  id: string
  publicKey: string;
  pvKey: string;
  tokenBalance: number;
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
}

export type QType = [
  id: string,
  owner: User,
  stem: string,
  type: string,
  timestamp: number,
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