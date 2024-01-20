import { createHash } from "crypto";

class MerkleTree {
  constructor(transactions) {
    this.treeVal = [];
    this.transaction = transactions;
    this.branch = this.build();
    this.root = this.branch[0];
  }
  hashing = data => createHash("SHA256").update(data).digest("hex");

  lengthCheck = total => {
    if (total.length % 2 == 1) total.push(total[total.length - 1]);
    return total.slice();
  };

  leafHash = treeNode => {
    let nodes = [];
    treeNode = this.lengthCheck(treeNode);
    for (let i = 0; i < treeNode.length; i += 2)
      nodes.push(this.hashing(treeNode[i] + treeNode[i + 1]));
    return nodes;
  };

  build = () => {
    let leaf = this.transaction.map((val) => this.hashing(val));
    leaf = this.lengthCheck(leaf);

    let treeNode = [...leaf];

    while (treeNode.length > 1) {
      this.treeVal.push(...treeNode);
      treeNode = this.leafHash(treeNode);
    }
    return treeNode;
  };

  verification = (transaction) => {
    let node = this.hashing(transaction);
    for (let i = 0; i < this.treeVal.length; i++)
      if (this.treeVal[i] == node) return "Transaction Found";

    return "Transaction Not Found";
  };

  merkleRoot = () => this.root;
}

let arr = ["txt1", "txt2", "txt3", "txt4"];
const merkleTree = new MerkleTree(arr);

let input1 = "txt6";
let input2 = "txt3";

console.log("\nRoot => ", merkleTree.merkleRoot());
console.log(`\n ${input1} - ${merkleTree.verification(input1)} `);
console.log(`\n ${input2} - ${merkleTree.verification(input2)} \n`);
