import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './nillionOrgConfig.js';
import schema from './schema.json' assert { type: 'json' };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    // Create a new collection schema for all nodes in the org
    const collectionName = 'Api keys and private keys';
    const newSchema = await org.createSchema(schema, collectionName);
    console.log('✅ New Collection Schema created for all nodes:', newSchema);
    console.log('👀 Schema ID:', newSchema[0].result.data);
  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();