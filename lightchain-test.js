let address1 = new Address("address 1", 3);
let address2 = new Address("address 2", 7);

let transactions = [
  new Transaction(address1, address2, 2),
  new Transaction(address2, address1, 3)
];

let network = new Network([
  new Miner("miner 1", new BlockChain([new Block()])),
  new Miner("miner 2", new BlockChain([new Block()])),
  new Miner("miner 3", new BlockChain([new Block()])),
  new Miner("miner 4", new BlockChain([new Block()]))
]);

network.mineNextBlock(transactions, () => {
  console.log("new block was mined succcessfully");
  console.log("Balance of address 1 is " + network.miners[2].blockChain.getAddressBalance(address1));
  console.log("Balance of address 2 is " + network.miners[3].blockChain.getAddressBalance(address2));
});