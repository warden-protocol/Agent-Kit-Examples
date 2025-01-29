import { gmail_v1, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getGmailAuth } from './auth';
import { EmailParser } from './parser';
import { EmailRequest } from './types';
import { EMAIL_CONFIG } from '../../config/email';

export class EmailService {
  private gmail: gmail_v1.Gmail;

  constructor(private auth: OAuth2Client) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  static async initialize(): Promise<EmailService> {
    const auth = await getGmailAuth();
    return new EmailService(auth);
  }

  async watchInbox(callback: (request: EmailRequest) => Promise<void>) {
    setInterval(async () => {
      try {
        const messages = await this.getUnreadMessages();
        for (const message of messages) {
          const request = await EmailParser.parseMessage(message);
          await callback(request);
          await this.markAsRead(message.id!);
        }
      } catch (error) {
        console.error('Error processing emails:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  private async getUnreadMessages(): Promise<gmail_v1.Schema$Message[]> {
    const response = await this.gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
    });

    const messages = response.data.messages || [];
    return Promise.all(
      messages.map(msg => 
        this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        }).then(res => res.data)
      )
    );
  }

  private async markAsRead(messageId: string) {
    await this.gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
  }
}

// Add Gmail inbox monitoring and email processing service

