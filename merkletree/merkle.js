const crypto = require("crypto");

class MerkleTree {
  constructor(transactions) {
    this.treeVal = [];
    this.transaction = transactions;
    this.branch = this.build();
    this.root = this.branch[0];
  }
  hashing = (data) => crypto.createHash("SHA256").update(data).digest("hex");

  lengthCheck = (total) => {
    if (total.length % 2 == 1) total.push(total[total.length - 1]);
    return total;
  };

  leafHash = (treeNode) => {
    let nodes = [];
    treeNode = this.lengthCheck(treeNode);
    for (let i = 0; i < treeNode.length; i += 2) 
      nodes.push(this.hashing(treeNode[i] + treeNode[i + 1]));
    
    return nodes;
  };

  build = () => {
    let leaf = this.transaction.map((val) => this.hashing(val));
    leaf = this.lengthCheck(leaf);

    let treeNode = leaf.slice();

    while (treeNode.length > 1) {
      this.treeVal.push(treeNode.slice());
      treeNode = this.leafHash(treeNode);
    }
    this.treeVal.push(treeNode); 
    return treeNode;
  };

  validation = (transaction) => {
    let node = this.hashing(transaction);
    for (let i = 0; i < this.treeVal.length; i++)
        if (this.treeVal[0][i] == node) return "Transaction Found";

    return "Transaction Not Found";
  };

  merkleRoot = () => this.root;
}

let arr = ["1", "2", "3", "4","8","7","20"];
const merkleTree = new MerkleTree(arr);

let input1 = "6";
let input2 = "3";

console.log("\nRoot => ", merkleTree.merkleRoot());
console.log(`\n ${input1} - ${merkleTree.validation(input1)}`);
console.log(`\n ${input2} - ${merkleTree.validation(input2)} \n`);

merkleTree.treeVal.reverse();
let val = merkleTree.treeVal;
let co = 1;

for (let i = 0; i < val.length; i++) {
  console.log(`Level ${co}\n`);

  for (let j = 0; j < val[i].length; j++) {
    console.log(`${val[i][j]}\n`);
  }

  console.log("\n");
  co++;
}
