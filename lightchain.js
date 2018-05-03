class Block {
  constructor(previousHash, timestamp, transactions = [], nonce = 0, hash = undefined) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.hash = hash || this.calculateHash();
    this.nonce = nonce;
    this.transactions = transactions;
  }

  calculateHash() {
    return md5(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce);
  }
}

class Address {
  constructor(address, balance) {
    this.address = address;
    this.balance = balance;
  }
}

class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

class Miner {
  constructor(name, blockChain) {
    this.name = name;
    this.blockChain = blockChain;
  }

  mineBlock(transactions, blockChain, callback) {
    let minerWorker = operative(function(args, cb) {
      const newBlock = args[0];
      const difficulty = args[1];
      
      while (newBlock.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        newBlock.nonce++;
        newBlock.hash = md5(newBlock.previousHash + newBlock.timestamp + JSON.stringify(newBlock.transactions) + newBlock.nonce);
      }
      
      cb(newBlock);
    }, ["https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js"]);
    
    let newBlock = new Block(
      blockChain.getLatestBlock().hash,
      new Date().getTime(),
      transactions
    );

    minerWorker([newBlock, blockChain.miningDifficulty], function(newBlock) {
      callback(newBlock);
    });
  }

  isValidNewBlock(newBlock) {
    return newBlock.previousHash === this.blockChain.getLatestBlock().hash;
  }

  addBlock(newBlock, minerName) {
    const latestBlock = this.blockChain.getLatestBlock();
    if(this.isValidNewBlock(latestBlock, newBlock)) {
      newBlock.minerName = minerName;
      this.blockChain.blocks.push(newBlock);
    }
  }

}

class BlockChain {

  constructor(genesisBlock, miningDifficulty) {
    this.blocks = [genesisBlock];
    this.miningDifficulty = miningDifficulty;
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

}