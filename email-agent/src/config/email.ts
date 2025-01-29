import path from 'path';

export const EMAIL_CONFIG = {
  CREDENTIALS_PATH: path.join(process.cwd(), 'credentials.json'),
  TOKEN_PATH: path.join(process.cwd(), 'token.json'),
  SCOPES: ['https://www.googleapis.com/auth/gmail.modify'],
  TREASURY_EMAIL: process.env.TREASURY_EMAIL
};