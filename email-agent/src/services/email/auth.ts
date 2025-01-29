import { authenticate } from '@google-cloud/local-auth';
import { EMAIL_CONFIG } from '../../config/email';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function getGmailAuth() {
  try {
    return authenticate({
      keyfilePath: EMAIL_CONFIG.CREDENTIALS_PATH,
      scopes: EMAIL_CONFIG.SCOPES
    });
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}