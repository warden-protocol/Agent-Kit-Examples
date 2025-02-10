require('dotenv').config();
const { ethers } = require('ethers');
const grpc = require('@grpc/grpc-js');
const { DisperserClient } = require('../eigenDA/bindings/disperser/disperser_grpc_pb');
const { DisperseBlobRequest, BlobStatusRequest, RetrieveBlobRequest } = require('../eigenDA/bindings/disperser/disperser_pb');

const EIGEN_ENDPOINT = 'disperser-holesky.eigenda.xyz:443';

var rpcBaseAddress = '';
var privateKey = '';
let client;

function init() {
  rpcBaseAddress = process.env.OTHENTIC_CLIENT_RPC_ADDRESS;
  privateKey = process.env.PRIVATE_KEY;
  client = new DisperserClient(EIGEN_ENDPOINT, grpc.credentials.createSsl());
}

async function sendTask(proofOfTask, data, taskDefinitionId) {
  var wallet = new ethers.Wallet(privateKey);
  var performerAddress = wallet.address;
  data = ethers.hexlify(ethers.toUtf8Bytes(data));
  const message = ethers.AbiCoder.defaultAbiCoder().encode(["string", "bytes", "address", "uint16"], [proofOfTask, data, performerAddress, taskDefinitionId]);
  const messageHash = ethers.keccak256(message);
  const sig = wallet.signingKey.sign(messageHash).serialized;

  const jsonRpcBody = {
    jsonrpc: "2.0",
    method: "sendTask",
    params: [
      proofOfTask,
      data,
      taskDefinitionId,
      performerAddress,
      sig,
    ]
  };
  try {
    const provider = new ethers.JsonRpcProvider(rpcBaseAddress);
    const response = await provider.send(jsonRpcBody.method, jsonRpcBody.params);
    console.log("API response:", response);
  } catch (error) {
    console.error("Error making API request:", error);
  }
}

async function publishToEigenDA(data) {
  let proofOfTask = '';
  let poll = null;
  try {
    const encoded = encode(data);
    const request = new DisperseBlobRequest();
    request.setData(encoded);
    const response = await disperseBlob(client, request);
    proofOfTask = response.toObject().requestId;
    console.log(`proofOfTask: ${proofOfTask}`);
    poll = pollForBlobStatus(client, proofOfTask);
  } catch (error) {
    console.error("Error making API request to EigenDA:", error);
  }
  return [proofOfTask, poll];
}

function pollForBlobStatus(client, cid, interval = 30000) {
  const statusRequest = new BlobStatusRequest();
  statusRequest.setRequestId(cid);

  return new Promise((resolve, reject) => {
    const poll = setInterval(async () => {
      try {
        const statusResponse = await getBlobStatus(client, statusRequest);
        const blobIndex = statusResponse.getInfo()?.getBlobVerificationProof()?.getBlobIndex();
        const batchHeaderHash = statusResponse.getInfo()?.getBlobVerificationProof()?.getBatchMetadata()?.getBatchHeaderHash();

        if (blobIndex && batchHeaderHash) {
          clearInterval(poll); // Stop polling once we have valid data

          const retrieveRequest = new RetrieveBlobRequest();
          retrieveRequest.setBlobIndex(blobIndex);
          retrieveRequest.setBatchHeaderHash(batchHeaderHash);
          const response = await retrieveBlob(client, retrieveRequest);
          const blob = Buffer.from(response.getData()).toString('utf-8').replace(/\0/g, '');  // regex is necessary because eigenDA encoding includes null bytes which are invalid in JSON
          resolve(JSON.parse(blob)); // Return the parsed data
        } else {
          console.log('Blob dispersal is still in progress. Blob status:');
          console.log(statusResponse.toObject());
        }
      } catch (error) {
        clearInterval(poll); // Stop polling in case of error
        reject(error); // Reject the promise if there's an error
      }
    }, interval);
  });
}

function getBlobStatus(client, request) {
  return new Promise((resolve, reject) => {
    client.getBlobStatus(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function disperseBlob(client, request) {
  return new Promise((resolve, reject) => {
    client.disperseBlob(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function retrieveBlob(client, request) {
  return new Promise((resolve, reject) => {
    client.retrieveBlob(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function encode(data) {
  const inputBuffer = Buffer.from(JSON.stringify(data), 'utf-8');
  const outputBuffer = encodeToBN254FieldElements(inputBuffer);
  return outputBuffer.toString('base64');
}

function encodeToBN254FieldElements(inputBuffer) {
  const nullByte = Buffer.from([0x00]);
  const byteGroupSize = 31;
  const outputBuffers = [];

  for (let i = 0; i < inputBuffer.length; i += byteGroupSize) {
    // Extract the next 31-byte chunk from the input buffer
    const chunk = inputBuffer.subarray(i, i + byteGroupSize);

    // Prepend the chunk with a null byte and push it to the output array
    outputBuffers.push(Buffer.concat([nullByte, chunk]));
  }

  // Concatenate all chunks into a single output buffer
  return Buffer.concat(outputBuffers);
}

module.exports = {
  init,
  publishToEigenDA,
  sendTask,
}
