require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const { DisperserClient } = require('../eigenDA/bindings/disperser/disperser_grpc_pb');
const { BlobStatusRequest, RetrieveBlobRequest } = require('../eigenDA/bindings/disperser/disperser_pb');

const EIGEN_ENDPOINT = 'disperser-holesky.eigenda.xyz:443';
var client;

function init() {
  client = new DisperserClient(EIGEN_ENDPOINT, grpc.credentials.createSsl());
}


async function getEigenDATask(cid) {
  const statusRequest = new BlobStatusRequest();
  statusRequest.setRequestId(cid);
  const statusResponse = await getBlobStatus(client, statusRequest);
  const blobIndex = statusResponse.getInfo()?.getBlobVerificationProof()?.getBlobIndex();
  const batchHeaderHash = statusResponse.getInfo()?.getBlobVerificationProof()?.getBatchMetadata()?.getBatchHeaderHash();

  if (!blobIndex || !batchHeaderHash) {
    console.log('Blob dispersal is still in progress. Blob status:');
    console.log(statusResponse.toObject());
    return null;
  }

  const retrieveRequest = new RetrieveBlobRequest();
  retrieveRequest.setBlobIndex(blobIndex);
  retrieveRequest.setBatchHeaderHash(batchHeaderHash);
  const response = await retrieveBlob(client, retrieveRequest);
  const data = Buffer.from(response.getData()).toString('utf-8').replace(/\0/g, '');
  return JSON.parse(data);
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

module.exports = {
  init,
  getEigenDATask,
}