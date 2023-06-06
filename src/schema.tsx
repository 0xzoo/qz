await db.applySchema(`
  collection User {
    id: string;

    @delegate
    @read
    publicKey: PublicKey;

    constructor () {
      if (!ctx.publicKey) {
        error('You must sign the transaction');
      }
      this.id = ctx.publicKey.toHex();
      this.publicKey = ctx.publicKey;
    }
  }

  @read
  collection Qs {
    id: string;
    
    @delegate
    owner: User;
    value: string;
    timestamp: number;
    answers: string[];
    numAnswers: number;

    constructor (id: string, owner: User, timestamp: number, answers: string[]) {
      this.id = id;
      this.owner = owner;
      this.timestamp = timestamp;
      this.answers = answers;
      this.numAnswers = 0;
    }
  }

  collection A {
    id: string;

    @delegate
    owner: User;
    qId: Q;
    value: string;
    timestamp: number;
    
    @read
    allowed: User[];
    edited: boolean;

    constructor (id:string, owner: string, qId: Q, value: string, timestamp: number) {
      this.id = id;
      this.owner = name;
      this.qId = qId;
      this.value = value;
      this.timestamp = timestamp;
      this.allowed = [];
      this.edited = false;
    }

    @call(owner)
    updateA (newValue: string, timestamp: number) {
      this.value = newValue;
      this.timestamp = timestamp;
      this.edited = true;
    }

    @call(owner)
    addToAllowed (user: User) {
      this.allowed.push(user);
    }
  }
`,
  "your-namespace"
); // your-namespace is optional if you have defined a default namespace
