collection Wallet {
  id: string;
  @read
  user: User;
  pvKey: string;
  pbKey: string;
  tokenBalance: number;
}

@public
collection UserProfile {
  id: string;
  createdAt: number;
  @delegate
  owner: User;
  email?: string;
  name?: string;
  desc?: string;
  twitter?: string;

  constructor (id: string, createdAt: number, email?: string, name?: string, desc?: string, twitter?: string[]) {
    this.id = id;
    this.createdAt = createdAt;
    if (email) {this.email = email;}
    if (name) {this.name = name;}
    if (desc) {this.desc = desc;}
    if (socials) {this.socials = socials;}
  }

  setProfile(name?: string, desc?: string, twitter?: string, email?: string) {
    if (this.id != ctx.publicKey.toHex()) {
      throw error ('invalid owner');
    }
    if (name) {
      this.name = name;
    }
    if (desc) {
      this.desc = desc;
    }
    if (twitter) {
      this.twitter = twitter;
    }
    if (email) {
      this.twitter = email;
    }
  }
}

collection User {
  id: string;

  @delegate
  publicKey: PublicKey;
  wpbKey: string;
  wpvKey: string;
  tokenBalance: number;
  createdAt: number;

  constructor (id: string, wpbKey: string, wpvKey: string, createdAt: number) {
    if (!ctx.publicKey) {
      error('You must sign the transaction');
    }
    this.id = id;
    this.publicKey = ctx.publicKey;
    this.tokenBalance = 100;
    this.wpbKey = wpbKey;
    this.wpvKey = wpvKey;
    this.createdAt = createdAt;
  }
}

@public
collection Qz {
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
  tags?: string[];

  @index(owner, [timestamp, desc]);
  @index(owner, [timestamp, asc]);
  @index([pubAz, desc]);

  constructor (id: string, stem: string, type: string, timestamp: number, anon: boolean, owner?: User, parent?: string, az?: string[]) {
    this.id = id;
    this.owner = owner;
    this.stem = stem;
    this.type = type;
    this.timestamp = timestamp;
    this.pubAz = 0;
    this.prvAz = 0;
    this.forks = [];
    this.followUps = [];
    this.anon = anon;
    
    if (owner != null) {
      this.owner = owner;
    }
    if (parent != null) {
      this.parent = parent;
    }
    if (az != null) {
      this.az = az;
    }
  }

  incrPubAz (id: string) {
    this.pubAz += 1;
  }

  incrPrivAz (id: string) {
    this.pubAz += 1;
  }
}

@public
collection PubAz {
  id: string;
  qId: Qz;
  timestamp: number;
  edited: boolean;
  anon: boolean;
  owner?: User;
  qIndex?: number;
  value?: string;
  importance?: number;
  asset?: string;

  @index(owner, [timestamp, desc]);
  @index(qId, edited, [timestamp, desc]);
  @index(owner, qId, [timestamp, desc]);

  constructor (id:string, qId: Qz, timestamp: number, anon: boolean, owner?: User, qIndex?: number, value?: string, importance?: number, asset?: string) {
    this.id = id;
    this.qId = qId;
    this.timestamp = timestamp;
    this.anon = anon;
    if (owner != null) {
      this.owner = owner;
    }
    if (qIndex != null) {
      this.qIndex = qIndex;
    }
    if (value != null) {
      this.value = value;
    }
    this.edited = false;
    if (importance != null) {
      this.importance = importance;
    }
    if (asset != null) {
      this.asset = asset;
    }
  }
  
  markAEdited (id: string) {
    if (ctx.publicKey != this.owner.publicKey) {
      error('You cannot perform this action');
    } else {
      this.edited = true;
    }
  }

  del () {
    if (ctx.publicKey != this.owner.publicKey) {
      error('You cannot perform this action');
    }
    selfdestruct();
  }
}

collection PrivAz {
  id: string;
  owner: User;
  qId: Qz;
  timestamp: number;
  edited: boolean;
  @read
  allowList: User[];
  qIndex?: number;
  value?: string;
  importance?: number;
  asset?: string;

  @index(owner, [timestamp, desc]);
  @index(qId, edited, [timestamp, desc]);
  @index(owner, qId, [timestamp, desc]);

  constructor (id:string, owner: User, qId: Qz, timestamp: number, qIndex?: number, value?: string, importance?: number, asset?: string, allowList?: User[]) {
    this.id = id;
    this.owner = owner;
    this.qId = qId;
    if (allowList != null) {
      this.allowList = allowList;
    } else {
      this.allowList = [owner];
    }
    if (qIndex != null) {
      this.qIndex = qIndex;
    }
    if (value != null) {
      this.value = value;
    }
    this.timestamp = timestamp;
    this.edited = false;
    if (importance != null) {
      this.importance = importance;
    }
    if (asset != null) {
      this.asset = asset;
    }
  }

  markAEdited (id: string) {
    if (ctx.publicKey != this.owner.publicKey) {
      error('You cannot perform this action');
    }
    this.edited = true;
  }

  del () {
    if (ctx.publicKey != this.owner.publicKey) {
      error('You cannot perform this action');
    }
    selfdestruct();
  }
}

@public
collection Followers {
  id: string;
  follower: User;
  followee: User;
  admitted?: boolean;

  @index(follower, followee, admitted);
  @index(followee, admitted);

  constructor (follower: User, followee: User) {
    this.id = follower.id + '/' + followee.id;
    this.follower = follower;
    this.followee = followee;
    this.granted = false;
  }

  admit () {
    if (ctx.publicKey != this.followee.publicKey) {
      error('You cannot perform this action');
    }
    this.admitted = true;
  }
  
  del () {
    if (ctx.publicKey != this.followee.publicKey || this.follower.publicKey) {
      error('You cannot perform this action');
    }
    selfdestruct();
  }
}

@public
collection Pins {
  id: string;
  pinner: string;
  qId: string;
  timestamp: number;
  $pk: string;

  @index(pinner, [timestamp, desc]);

  constructor (pinner: string, qId: string, timestamp: number) {
    this.id = pinner + '/' + qId;
    this.pinner = pinner;
    this.qId = qId;
    this.timestamp = timestamp;
    this.$pk = ctx.publicKey.toHex();
  }
}