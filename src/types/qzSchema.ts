@public
collection User {
  id: string;

  @delegate
  publicKey: PublicKey;
  @read
  wpbKey: string;
  @read
  wpvKey: string;
  tokenBalance: number;
  createdAt: number;
  name?: string;
  desc?: string;
  twitter?: string;
  email?: string;

  constructor (id: string, wpbKey: string, wpvKey: string, createdAt: number, email?: string) {
    if (!ctx.publicKey) {
      error('You must sign the transaction');
    }
    this.id = id;
    this.publicKey = ctx.publicKey;
    this.tokenBalance = 100;
    this.wpbKey = wpbKey;
    this.wpvKey = wpvKey;
    this.createdAt = createdAt;
    this.email = email;
  }

  setProfile(name?: string, desc?: string, twitter?: string, email?: string) {
    if (this.publicKey != ctx.publicKey) {
      throw error ('invalid owner');
    }
    this.name = name;
    this.desc = desc;
    this.twitter = twitter;
    this.twitter = email;
  }
}

@public
collection Qz {
  id: string;
  owner: User;
  stem: string;
  type: string;
  timestamp: number;
  pubAz: number;
  prvAz: number;
  forks: string[];
  followUps: string[];
  parent?: string;
  az?: string[];
  tags?: string[];

  @index(owner, [timestamp, desc]);
  @index(owner, [timestamp, asc]);
  @index([pubAz, desc]);

  constructor (id: string, owner: User, stem: string, type: string, timestamp: number, parent?: string, az?: string[]) {
    this.id = id;
    this.owner = owner;
    this.stem = stem;
    this.type = type;
    this.timestamp = timestamp;
    this.pubAz = 0;
    this.prvAz = 0;
    this.forks = [];
    this.followUps = [];
    this.parent = parent;
    this.az = az;
  }

  incrPubAz (id: string) {
    this.pubAz += 1;
  }
}

@public
collection PubAz {
  id: string;
  owner: User;
  qId: Qz;
  timestamp: number;
  edited: boolean;
  qIndex?: number;
  value?: string;
  importance?: number;
  asset?: string;

  @index(owner, [timestamp, desc]);
  @index(qId);

  constructor (id:string, owner: User, qId: Qz, timestamp: number, qIndex?: number, value?: string, importance?: number, asset?: string) {
    this.id = id;
    this.owner = owner;
    this.qId = qId;
    this.qIndex = qIndex;
    this.value = value;
    this.timestamp = timestamp;
    this.edited = false;
    this.importance = importance;
    this.asset = asset;
  }

  @call(owner)
  updateA (newValue: string, timestamp: number) {
    this.value = newValue;
    this.timestamp = timestamp;
    this.edited = true;
  }
}

// @public
// collection User {
//   id: string;

//   @delegate
//   publicKey: PublicKey;
//   wpbKey: string;
//   wpvKey: string;
//   tokenBalance: number;
//   createdAt: number;
//   name?: string;
//   desc?: string;
//   twitter?: string;
//   email?: string;

//   constructor (id: string, wpbKey: string, wpvKey: string, createdAt: number, email?: string) {
//     if (!ctx.publicKey) {
//       error('You must sign the transaction');
//     }
//     this.id = id;
//     this.publicKey = ctx.publicKey;
//     this.tokenBalance = 100;
//     this.wpbKey = wpbKey;
//     this.wpvKey = wpvKey;
//     if (email) {
//       this.email = email;
//     }
//   }

//   setProfile(name?: string, desc?: string, twitter?: string) {
//     if (this.publicKey != ctx.publicKey) {
//       throw error ('invalid owner');
//     }
//     if (name) {
//       this.name = name;
//     }
//     if (desc) {
//       this.desc = desc;
//     }
//     if (twitter) {
//       this.twitter = twitter;
//     }
//   }
// }

// @public
// collection Qz {
//   id: string;
//   owner: User;
//   stem: string;
//   type: string;
//   timestamp: number;
//   numAz: number;
//   az?: string[];
//   tags?: string[];

//   @index(owner, [timestamp, desc]);
//   @index([numAz, desc]);

//   constructor (id: string, owner: User, stem: string, type: string, timestamp: number, az?: string[]) {
//     this.id = id;
//     this.owner = owner;
//     this.stem = stem;
//     this.type = type;
//     this.timestamp = timestamp;
//     if (az) {
//       this.az = az;
//     }
//     this.numAz = 0;
//   }

//   incrNumAz (id: string) {
//     this.numAz += 1;
//   }
// }

// @public
// collection Az {
//   id: string;
//   owner: User;
//   qId: Qz;
//   timestamp: number;
//   private: boolean;
//   edited: boolean;
//   qIndex?: number;
//   value?: string;
//   importance?: number;
//   asset?: string;

//   @index(owner, [timestamp, desc]);
//   @index(qId);

//   constructor (id:string, owner: User, qId: Qz, timestamp: number, private: boolean, qIndex?: number, value?: string, importance?: number, asset?: string) {
//     this.id = id;
//     this.owner = owner;
//     this.qId = qId;
//     if (qIndex) {
//       this.qIndex = qIndex;
//     }
//     if (value) {
//       this.value = value;
//     }
//     this.timestamp = timestamp;
//     this.private = private;
//     this.edited = false;

//     if (importance) {
//       this.importance = importance;
//     }

//     if (asset) {
//       this.asset = asset;
//     }
//   }

//   @call(owner)
//   updateA (newValue: string, timestamp: number) {
//     this.value = newValue;
//     this.timestamp = timestamp;
//     this.edited = true;
//   }
// }