import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './nillionOrgConfig.js';
const SCHEMA_ID = 'fb6563ba-c904-4479-923b-52a01450fb45';

const data = [
  {
    _id: uuidv4(),
    user_info: { 
      $allot: 'John Doe'
    },
    openai_api_key: { 
      $allot: 'sk-1234567890abcdef1234567890abcdef'
    },
    wallet_private_key: {
      $allot: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    },
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  }
];

async function main() {
    try {
      // Create a secret vault wrapper and initialize the SecretVault collection to use
      const collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        SCHEMA_ID
      );
      await collection.init();
  
      // Write collection data to nodes encrypting the specified fields ahead of time
      const dataWritten = await collection.writeToNodes(data);
      console.log(
        '👀 Data written to nodes:',
        JSON.stringify(dataWritten, null, 2)
      );
  
      // Get the ids of the SecretVault records created
      const newIds = [
        ...new Set(dataWritten.map((item) => item.result.data.created).flat()),
      ];
      console.log('uploaded record ids:', newIds);
  
      // Read all collection data from the nodes, decrypting the specified fields
      const decryptedCollectionData = await collection.readFromNodes({});
  
      // Log first 5 records
      console.log(
        'Most recent records',
        decryptedCollectionData.slice(0, data.length)
      );
    } catch (error) {
      console.error('❌ SecretVaultWrapper error:', error.message);
      process.exit(1);
    }
  }
  
  main();