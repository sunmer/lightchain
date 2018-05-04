let blockChain = new BlockChain(new Block(new Block("0", new Date().getTime())));

let miners = [
  new Miner("miner 1", blockChain),
  new Miner("miner 2", blockChain)
];

const address1 = new Address("address 1", 4);
const address2 = new Address("address 2", 6);

let transactions = [
  new Transaction(address1, address2, 3),
  new Transaction(address2, address1, 4)
];

let isValidNewBlock = false;
let hasBlockBeenMined = false;

for(let i = 0; i < miners.length; i++) {
  const miner = miners[i];
  console.log(miner.name + " is mining");

  miner.mineBlock(transactions, broadcastToNetwork);
}

function broadcastToNetwork(newBlock) {
  newBlock = new Block(
    newBlock.previousHash, 
    newBlock.timestamp, 
    newBlock.transactions, 
    newBlock.nonce, 
    newBlock.hash
  );

  for(let y = 0; y < miners.length; y++) {
    if(miners[y].isValidNewBlock(newBlock)) {
      isValidNewBlock = true;
    }
  }

  if(isValidNewBlock && !hasBlockBeenMined) {
    let transactionsToMake = newBlock.transactions;
    newBlock.transactions = JSON.parse(JSON.stringify(newBlock.transactions));

    for(let i = 0; i < transactionsToMake.length; i++) {
      let transaction = transactionsToMake[i];
      transaction.from.balance = transaction.from.balance - transaction.amount;
      transaction.to.balance = transaction.to.balance + transaction.amount;
    }
    
    blockChain.blocks.push(newBlock);

    for(let i = 0; i < miners.length; i++) {
      miners[i].blockChain = blockChain;
    }

    hasBlockBeenMined = true;
    console.log(newBlock);
  }
}