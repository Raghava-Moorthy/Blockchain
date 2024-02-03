const crypto = require("crypto");

class MerkleTree {
  constructor(transactions) {
    //Constructor to get the input parameters and to create a empty array
    this.transaction = transactions; //  Input transactions value
    this.treeVal = []; // 2D matrix to store the values in an array on each row
    this.branch = this.build(); //  Function to build the tree
    this.root = this.branch[0]; //  Get the root element from the (build) function
  }
  hashing = (data) => crypto.createHash("SHA256").update(data).digest("hex"); //  Hashing the value

  lengthCheck = (total) => {
    //  Function to check whether the length is even or not
    if (total.length % 2 == 1) total.push(total[total.length - 1]); //  Duplicate the last element if the length is odd
    return total; //  Return the array
  };

  leafHash = (treeNode) => {
    // A function to create each row of the merkle tree
    let nodes = [];
    treeNode = this.lengthCheck(treeNode); // Check the length of the nodes before performing the hashing operation
    for (let i = 0; i < treeNode.length; i += 2)
      nodes.push(this.hashing(treeNode[i] + treeNode[i + 1])); //  Perform hashing operation on the combination of both left and right leaf nodes
    return nodes; //  Return the array
  };

  build = () => {
    //  This function creates a tree with all the leafnodes using the (leafHash) function
    let leaf = this.transaction.map((val) => this.hashing(val)); //  Create an array and map the hash value of all the transaction that is passed to this class (from Constructor)
    while (leaf.length > 1) {
      //  This while loop runs until the root element is obtained
      this.treeVal.push(leaf); //  Push all the available hash values as an array into the 2D array
      leaf = this.leafHash(leaf); //  Pass the array into the leafHash function to get the next level hash values
    }
    this.treeVal.push(leaf); //  Push the Root hash value into the 2D array
    return leaf; //  Return the leaf array to get the root value
  };
  merkleRoot = () => this.root; //  merkleRoot function returns the merkleRoot value that is obtained from the build funtion

  validation = (transaction) => {
    /*
    Validation function us used to find whether the given transaction id valid or not by finding the input's hashvalue,
     then get the root value and compare the current root value with the already stored root value and return the result as true if both value are same else it returns false
     */
    let node = this.hashing(transaction); //  Hahsing the passed input value
    let l = -1;
    for (let i = 0; i < this.treeVal.length - 1; i++) {
      // This loop runs until the element is not found or the root value is obtained
      // Creating two loops to run for both rows and columns to find whether the hash value is present or not
      for (let j = 0; j < this.treeVal[i].length; j++) {
        if (node == this.treeVal[i][j]) {
          //  If the hash value is present then it stores it current index value and breaks the loop for further operation
          l = j;
          break;
        }
      }

      if (l == -1)
        return false; //  Returns the result as false if the hash value is not present in the matrix
      else {
        if (l % 2 == 0 && l == this.treeVal[i].length - 1) {
          /* 
          Check whether the index of the element is in even Position and the last element 
          if the condition is true then it hash the current input hash by combine as the left as well as the right node and store it in the node variable  
          */
          node = this.hashing(node + node);
        } else if (l % 2 != 0) {
          /*  
          If the index of the hash value is in odd position then it takes the previous hash value and the current input hash value 
          and create a new hash value by combining both the hash values
          */
          node = this.hashing(this.treeVal[i][l - 1] + node);
        } else {
          /*
            If the index is not in the odd position as well as in the even and last element,
            Then it only present in the even position but not the last element. 
            So it takes the current node hash value and the nect index hash value and create a new hash value by combining both hash values
           */
          node = this.hashing(node + this.treeVal[i][l + 1]);
        }
      }
    }
    return node == this.root; // Returns the value as true if the current root value and the stored root value is same, else it returns false
  };
} // End of the class MerkleTree

let arr = ["1", "2", "3", "4", "8"]; // A default dummy input
const merkleTree = new MerkleTree(arr); // Create a object for the class MerkleTree

//  Two dummy values to validate whether the transactions are present or not
let input1 = "3";
let input2 = "6";

//  Console to see the Output
console.log("\nRoot => ", merkleTree.merkleRoot());
console.log(`\n ${input1} - ${merkleTree.validation(input1)}`);
console.log(`\n ${input2} - ${merkleTree.validation(input2)} \n`);

//  Reverse the whole matrix that is created in the MerkleTree class constructor
merkleTree.treeVal.reverse();
let val = merkleTree.treeVal;
//  Looping function to See the levels of the Merkle tree from the top root element value to the bottom leaf element value
for (let i = 0; i < val.length; i++) {
  console.log(`Level ${i + 1}\n`);
  for (let j = 0; j < val[i].length; j++) console.log(`${val[i][j]}\n`);
  console.log("\n");
}
