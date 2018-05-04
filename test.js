let address1 = new Address("address 1", 1);
let address2 = new Address("address 2", 2);

let transactions = [
  new Transaction(address1, address2, 1),
  new Transaction(address2, address1, 2)
];

let network = new Network([
  new Miner("miner 1", new BlockChain(new Block()), transactions),
  new Miner("miner 2", new BlockChain(new Block()), transactions),
  new Miner("miner 3", new BlockChain(new Block()), transactions),
  new Miner("miner 4", new BlockChain(new Block()), transactions)
]);

network.mineNextBlock();