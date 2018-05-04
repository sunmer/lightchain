let blockChain = new BlockChain(new Block(new Block("0", new Date().getTime())));

let address1 = new Address("address 1", 1);
let address2 = new Address("address 2", 2);

let transactions = [
  new Transaction(address1, address2, 1),
  new Transaction(address2, address1, 2)
];

let network = new Network([
  new Miner("miner 1", blockChain),
  new Miner("miner 2", blockChain),
  new Miner("miner 3", blockChain)
], transactions);

network.mineNextBlock(broadcastToNetwork);

function broadcastToNetwork(newBlock) {
  let isValidNewBlock = false;
  let hasBlockBeenMined = false;

  newBlock = new Block(
    newBlock.previousHash, 
    newBlock.timestamp, 
    newBlock.transactions, 
    newBlock.nonce, 
    newBlock.hash
  );

  for(let y = 0; y < network.miners.length; y++) {
    if(network.miners[y].isValidNewBlock(newBlock)) {
      isValidNewBlock = true;
    }
  }

  if(isValidNewBlock && !hasBlockBeenMined) {
    blockChain.blocks.push(newBlock);

    for(let i = 0; i < network.miners.length; i++) {
      network.miners[i].blockChain = blockChain;
    }

    hasBlockBeenMined = true;
    console.log(newBlock);
    console.log(blockChain.getAddressBalance(address1));
    console.log(blockChain.getAddressBalance(address2));
  }
}