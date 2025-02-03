import path from 'path';

export const EMAIL_CONFIG = {
  CREDENTIALS_PATH: path.join(process.cwd(), 'credentials.json'),
  TOKEN_PATH: path.join(process.cwd(), 'token.json'),
  SCOPES: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
  ],
  ALLOWED_DOMAINS: ['wardenprotocol.org'],
  SUBJECT_KEYWORDS: ['payment', 'request', 'funds'],
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
};