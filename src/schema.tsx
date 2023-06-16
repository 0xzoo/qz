@public
collection User {
  id: string;

  @delegate
  @read
  publicKey: PublicKey;
  tokenBalance: number;
  hidePrivateAz?: boolean;
  name?: string;
  desc?: string;
  twitter?: string;

  constructor () {
    if (!ctx.publicKey) {
      error('You must sign the transaction');
    }
    this.id = ctx.publicKey.toHex();
    this.publicKey = ctx.publicKey;
    this.tokenBalance = 100;
  }

  setProfile(name?: string, desc?: string, twitter?: string) {
    if (this.publicKey != ctx.publicKey.toHex()) {
      throw error ('invalid owner');
    }
    if (this.name) {
      this.name = name;
    }
    if (this.desc) {
      this.desc = desc;
    }
    if (this.twitter) {
      this.twitter = twitter;
    }
  }
}

collection privateUser {
  id: string;

  @delegate
  @read
  owner: User;
  publicKey: string;
  encryptedPrivateKey: string;

  constructor (owner: User, publicKey: string, encryptedPrivateKey: string) {
    if (User.publicKey != ctx.publicKey) {
      error('invalid permissions');
    }
    this.id = ctx.publicKey.toHex();
    this.owner = owner;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;

  }
}

@read
collection Qz {
  id: string;
  
  @delegate
  owner: User;
  stem: string;
  type: string;
  timestamp: number;
  az: string[];
  numAz: number;
  tags?: string[];
  required?: boolean;

  @index(owner, [timestamp, desc]);

  constructor (id: string, owner: User, stem: string, type: string, timestamp: number, az: string[]) {
    this.id = id;
    this.owner = owner;
    this.stem = stem;
    this.type = string;
    this.timestamp = timestamp;
    this.az = az;
    this.numAz = 0;
  }

  incrNumAz (id: string) {
    this.numAz += 1;
  }
}

collection Az {
  id: string;

  @delegate
  owner: User;
  qId: Qz;
  qIndex: number;
  value: string;
  timestamp: number;
  private: boolean;
  edited: boolean;
  importance?: number;
  asset?: string;

  @index(owner, [timestamp, desc]);

  constructor (id:string, owner: User, qId: Qz, qIndex: number, value: string, timestamp: number, private: boolean, importance?: number, asset?: string) {
    this.id = id;
    this.owner = User;
    this.qId = qId;
    this.qIndex = qIndex;
    this.value = value;
    this.timestamp = timestamp;
    this.private = private;
    this.edited = false;

    if (this.importance) {
      this.importance = importance;
    }

    if (this.asset) {
      this.asset = asset;
    }
  }

  @call(owner)
  updateA (newValue: string, timestamp: number) {
    this.value = newValue;
    this.timestamp = timestamp;
    this.edited = true;
  }
}

collection AllowedAzReader {
  id: string;
  userId: string;
  aId: string;
  encryptedSymmetricKey: string;

  constructor (userId: string, aId: string, encryptedSymmetricKey: string) {
    this.id = userId + "-" + aId;
    this.userId = userId;
    this.aId = aId;
    this.encryptedSymmetricKey = encryptedSymmetricKey;
  }
}

collection ReadRequests {
  id: string;
  userId: string;
  aId: string;
  requesterId: string;
  timestamp: number;
  payment?: 
}
