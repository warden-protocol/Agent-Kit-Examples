// Script using ethers.js v5 for Flow VRF demo with tx hashes
const { ethers } = require('ethers');

// Configuration
const PRIVATE_KEY = '45e40ba25677e08f574d22af580f759d686aa84d5188be8d9420385a784f726a';
const RPC_URL = 'https://testnet.evm.nodes.onflow.org';
const contractAddress = "0xbDe037993Fdc44EB8fbb7EBcB19f8b4B004aBeAe";

// Contract ABI
const abi = [
    {"inputs":[{"internalType":"uint64","name":"min","type":"uint64"},{"internalType":"uint64","name":"max","type":"uint64"}],"name":"getRandomInRange","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getRandomNumber","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"randomNumber","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"min","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"max","type":"uint64"}],"name":"RandomInRangeGenerated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"randomNumber","type":"uint64"}],"name":"RandomNumberGenerated","type":"event"}
];

// Setup provider and signer
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Get a random number
async function getRandomNumber() {
    try {
        console.log("Generating random number...");
        const tx = await contract.getRandomNumber({
            gasLimit: 500000
        });
        
        console.log("Transaction Hash:", tx.hash);
        console.log("View on Explorer:", `https://evm-testnet.flowscan.io/tx/${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        // Find the RandomNumberGenerated event
        const event = receipt.events?.find(event => event.event === 'RandomNumberGenerated');
        
        if (event) {
            const randomNumber = event.args.randomNumber;
            console.log("Random number generated:", randomNumber.toString());
            return {
                randomNumber: randomNumber.toString(),
                txHash: tx.hash,
                blockNumber: receipt.blockNumber
            };
        }
    } catch (error) {
        console.error("Error generating random number:", error);
        throw error;
    }
}

// Get random number in range


// Example usage:
async function demo() {
    console.log("Starting random number demo...");
    console.log("Using wallet address:", wallet.address);
    
    // Get a random number
    console.log("\nTest 1: Getting a random number");
    const result1 = await getRandomNumber();
    console.log("Result 1:", result1);
    
    // Get a random number between 1 and 100
    console.log("\nTest 2: Getting a random number between 1 and 100");
    const result2 = await getRandomInRange(1, 100);
    console.log("Result 2:", result2);
}

// Run the demo
demo().then(() => {
    console.log("\nDemo completed!");
}).catch(error => {
    console.error("Demo failed:", error);
});