import * as grpc from 'grpc';
import * as readline from 'readline'; 

import { DisperserClient } from './eigenDA/bindings/disperser/disperser_grpc_pb';
import { 
    DisperseBlobRequest, 
    DisperseBlobReply, 
    BlobStatusRequest, 
    BlobStatusReply, 
    RetrieveBlobRequest, 
    RetrieveBlobReply,
} from './eigenDA/bindings/disperser/disperser_pb';
import { exit } from 'process';

const EIGEN_ENDPOINT = 'disperser-holesky.eigenda.xyz:443';

async function disperseBlobRoutine(data: any) {
    const client = new DisperserClient(EIGEN_ENDPOINT, grpc.credentials.createSsl());

    const encoded = encode(data);
    const request = new DisperseBlobRequest();
    request.setData(encoded);
    const response = await disperseBlob(client, request);
    console.log(response.toObject());
}

async function getBlobRoutine(requestId: string) {
    const client = new DisperserClient(EIGEN_ENDPOINT, grpc.credentials.createSsl());
    const statusRequest = new BlobStatusRequest();
    statusRequest.setRequestId(requestId);
    const statusResponse = await getBlobStatus(client, statusRequest);
    const blobIndex = statusResponse.getInfo()?.getBlobVerificationProof()?.getBlobIndex();
    const batchHeaderHash = statusResponse.getInfo()?.getBlobVerificationProof()?.getBatchMetadata()?.getBatchHeaderHash();

    if (!blobIndex || !batchHeaderHash) {
        console.log('Blob dispersal is still in progress. Blob status:');
        console.log(statusResponse.toObject());
        return;
    }

    const retrieveRequest = new RetrieveBlobRequest();
    retrieveRequest.setBlobIndex(blobIndex);
    retrieveRequest.setBatchHeaderHash(batchHeaderHash);
    const response = await retrieveBlob(client, retrieveRequest);
    console.log('Retrieved blob:');
    console.log(response.toObject());
    const data = Buffer.from(response.getData()).toString('utf-8');
    console.log('Decoded data:');
    console.log(data);
    console.log(JSON.parse(data.replace(/\0/g, '')));
}

function encode(data: any): string {
    const inputBuffer = Buffer.from(JSON.stringify(data), 'utf-8');
    const outputBuffer = encodeToBN254FieldElements(inputBuffer);
    return outputBuffer.toString('base64');
}

function decode(data: string): any {
    const inputBuffer = Buffer.from(data, 'base64');
    const outputBuffer = decodeFromBN254FieldElements(inputBuffer);
    return JSON.parse(outputBuffer.toString('utf-8'));
}

function encodeToBN254FieldElements(inputBuffer: Buffer): Buffer {
    const nullByte = Buffer.from([0x00]);
    const byteGroupSize = 31;
    const outputBuffers: Buffer[] = [];
  
    for (let i = 0; i < inputBuffer.length; i += byteGroupSize) {
      // Extract the next 31-byte chunk from the input buffer
      const chunk = inputBuffer.subarray(i, i + byteGroupSize);
  
      // Prepend the chunk with a null byte and push it to the output array
      outputBuffers.push(Buffer.concat([nullByte, chunk]));
    }
  
    // Concatenate all chunks into a single output buffer
    return Buffer.concat(outputBuffers);
}

function decodeFromBN254FieldElements(inputBuffer: Buffer): Buffer {
    const byteGroupSize = 32; // Original 31 bytes + 1 prepended null byte
    const outputBuffers: Buffer[] = []; // Array to hold the buffer chunks after removing null bytes
  
    for (let i = 0; i < inputBuffer.length; i += byteGroupSize) {
      // Calculate the end index for slicing, making sure not to exceed the buffer length
      const end = Math.min(i + byteGroupSize, inputBuffer.length);
  
      // Extract the chunk, skipping the first byte (the prepended null byte)
      const chunk = inputBuffer.slice(i + 1, end);
  
      // Push the chunk to the output array
      outputBuffers.push(chunk);
    }
  
    // Concatenate all chunks into a single output buffer
    return Buffer.concat(outputBuffers);
}

function disperseBlob(client: DisperserClient, request: DisperseBlobRequest): Promise<DisperseBlobReply> {
    return new Promise((resolve, reject) => {
        client.disperseBlob(request, (err: grpc.ServiceError | null, response: DisperseBlobReply ) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

function getBlobStatus(client: DisperserClient, request: BlobStatusRequest): Promise<BlobStatusReply> {
    return new Promise((resolve, reject) => {
        client.getBlobStatus(request, (err: grpc.ServiceError | null, response: BlobStatusReply) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

function retrieveBlob(client: DisperserClient, request: RetrieveBlobRequest): Promise<RetrieveBlobReply> {
    return new Promise((resolve, reject) => {
        client.retrieveBlob(request, (err: grpc.ServiceError | null, response: RetrieveBlobReply) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    const action = parseInt(await prompt("Choose action (1: Disperse Blob, 2: Retrieve Blob): "));
    if (action === 1) {
        const data = await prompt("Enter data to disperse: ");
        await disperseBlobRoutine(data);
    } else if (action === 2) {
        const requestId = await prompt("Enter request ID: ");
        await getBlobRoutine(requestId);
    } else {
        console.log(`Unrecognized action: ${action}`);
        exit(1);
    }
    exit(0);
}

main();