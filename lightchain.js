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
  constructor(name, blockChain, transactions) {
    this.name = name;
    this.blockChain = blockChain;
    this.transactions = transactions;
  }

  mineBlock(callback) {
    let minerWorker = operative(function(newBlock) {
      newBlock.transactions = JSON.parse(JSON.stringify(newBlock.transactions));
      
      while (newBlock.hash.substring(0, newBlock.difficulty) !== Array(newBlock.difficulty + 1).join("0")) {
        newBlock.nonce++;
        newBlock.hash = md5(newBlock.previousHash + newBlock.timestamp + JSON.stringify(newBlock.transactions) + newBlock.nonce);
      }
      
      this.deferred().fulfill(newBlock);
    }, ["https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.min.js"]);
    
    let newBlock = new Block(
      this.blockChain.getLatestBlock().hash,
      new Date().getTime(),
      this.transactions
    );

    minerWorker(newBlock).then(newBlock => callback(newBlock));
  }

  isValidNewBlock(newBlock) {
    return newBlock.previousHash === this.blockChain.getLatestBlock().hash && 
      newBlock.hash === newBlock.calculateHash();
  }

}

class BlockChain {

  constructor(genesisBlock) {
    this.blocks = [genesisBlock];
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
  constructor(miners = []) {
    this.miners = miners;
  }

  mineNextBlock() {
    for(let i = 0; i < this.miners.length; i++) {
      let miner = this.miners[i];
      console.log(miner.name + " is mining");
    
      miner.mineBlock(this.broadcastToNetwork);
    }
  }

  broadcastToNetwork(newBlock) {
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
        network.miners[i].transactions = [];
      }
  
      console.log(newBlock);
      console.log(network.miners[0].blockChain.getAddressBalance(address1));
      console.log(network.miners[3].blockChain.getAddressBalance(address2));
    }
  }

}