let blockChain = new BlockChain(new Block());

let address1 = new Address("address 1", 1);
let address2 = new Address("address 2", 2);

let transactions = [
  new Transaction(address1, address2, 1),
  new Transaction(address2, address1, 2)
];

let network = new Network([
  new Miner("miner 1", blockChain, transactions),
  new Miner("miner 2", blockChain, transactions),
  new Miner("miner 3", blockChain, transactions)
]);

network.mineNextBlock(() => {
  console.log(newBlock);
  console.log(blockChain.getAddressBalance(address1));
  console.log(blockChain.getAddressBalance(address2));
});