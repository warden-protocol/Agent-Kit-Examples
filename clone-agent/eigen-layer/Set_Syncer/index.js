const execSync = require('child_process').execSync;
const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();
let privateKeyDeployer = process.env.PRIVATE_KEY_DEPLOYER;
if (!privateKeyDeployer) {
    console.error("PRIVATE_KEY_DEPLOYER is not set.");
    process.exit(1);
}
let privateKeySyncer = process.env.PRIVATE_KEY_SYNCER;
if (!privateKeySyncer) {
    console.error("PRIVATE_KEY_SYNCER is not set.");
    process.exit(1);
}
if (!privateKeySyncer.startsWith("0x")) {
    privateKeySyncer = "0x" + privateKeySyncer;
}

if (!privateKeyDeployer.startsWith("0x")) {
    privateKeyDeployer = "0x" + privateKeyDeployer;
}
try { 
    const deployerAddress = ethers.computeAddress(privateKeyDeployer);
} catch(e) {
    console.error("Invalid PRIVATE_KEY_DEPLOYER");
    process.exit(1);
}
let syncerAddress;
try { 
    syncerAddress = ethers.computeAddress(privateKeySyncer);
} catch(e){
    console.error("Invalid PRIVATE_KEY_SYNCER");
    process.exit(1);
}
process.env.PRIVATE_KEY = privateKeyDeployer;
const output = execSync(`othentic-cli network set-syncer --syncer-address ${syncerAddress}`, { encoding: 'utf-8'});
console.log(output);



