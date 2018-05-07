class Block {
  constructor(
    previousHash = 0,
    timestamp = new Date().getTime(),
    transactions = [],
    nonce = 0,
    hash = undefined,
    difficulty = 4) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.hash = hash || this.calculateHash();
    this.nonce = nonce;
    this.transactions = transactions;
    this.difficulty = difficulty;
  }

  calculateHash() {
    return sha256(JSON.stringify(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce + this.difficulty));
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

  mineBlock(transactions, callback) {
    let minerWorker = operative(function(newBlock) {
      newBlock.transactions = JSON.parse(JSON.stringify(newBlock.transactions));
      
      while (newBlock.hash.substring(0, newBlock.difficulty) !== Array(newBlock.difficulty + 1).join("0")) {
        newBlock.nonce++;
        newBlock.hash = sha256(JSON.stringify(newBlock.previousHash + newBlock.timestamp + JSON.stringify(newBlock.transactions) + newBlock.nonce + newBlock.difficulty));
      }
      
      this.deferred().fulfill(newBlock);
    }, ["https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js"]);
    
    let newBlock = new Block(
      this.blockChain.getLatestBlock().hash,
      new Date().getTime(),
      transactions
    );

    minerWorker(newBlock).then(newBlock => callback(newBlock));
  }

  isValidNewBlock(newBlock) {
    return newBlock.previousHash === this.blockChain.getLatestBlock().hash && 
      newBlock.hash === newBlock.calculateHash();
  }

}

class BlockChain {

  constructor(blocks) {
    this.blocks = blocks;
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  getAddressBalance(address) {
    let balance = address.balance;

    for(let i = 0; i < this.blocks.length; i++) {
      let transactions = this.blocks[i].transactions;
      for(let y = 0; y < transactions.length; y++) {
        let transaction = transactions[y];
        if(transaction.from.address === address.address) {
          balance = balance - transaction.amount;
        } else if(transaction.to.address === address.address) {
          balance = balance + transaction.amount;
        }
      }
    }

    return balance;
  }

}

class Network {
  constructor(miners = [], transactions = []) {
    this.miners = miners;
    this.transactions = transactions;
  }

  mineNextBlock(transactions, callback) {
    for(let i = 0; i < this.miners.length; i++) {
      let miner = this.miners[i];
      console.log(miner.name + " is mining");

      miner.mineBlock(transactions, (newBlock) => 
        this.broadcastToNetwork(newBlock, () => callback())
      );
    }
  }

  broadcastToNetwork(newBlock, callback) {
    let isValidNewBlock = false;
    let hasBlockBeenMined = false;
  
    newBlock = new Block(
      newBlock.previousHash,
      newBlock.timestamp,
      newBlock.transactions,
      newBlock.nonce,
      newBlock.hash
    );
  
    for(let i = 0; i < network.miners.length; i++) {
      if(network.miners[i].isValidNewBlock(newBlock)) {
        isValidNewBlock = true;
      }
    }
  
    if(isValidNewBlock && !hasBlockBeenMined) {
      hasBlockBeenMined = true;

      for(let i = 0; i < network.miners.length; i++) {
        network.miners[i].blockChain.blocks.push(newBlock);
      }

      callback();
    }
  }

}