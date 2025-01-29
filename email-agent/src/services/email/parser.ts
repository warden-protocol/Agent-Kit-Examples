import { gmail_v1 } from 'googleapis';
import { EmailRequest } from './types';

export class EmailParser {
  static async parseMessage(message: gmail_v1.Schema$Message): Promise<EmailRequest> {
    const headers = message.payload?.headers;
    const from = headers?.find(h => h.name === 'From')?.value || '';
    const subject = headers?.find(h => h.name === 'Subject')?.value || '';
    const body = this.decodeBody(message.payload);
    const amount = this.extractAmount(body);

    return {
      id: message.id || '',
      from,
      subject,
      body,
      amount,
      timestamp: new Date(Number(message.internalDate))
    };
  }

  private static decodeBody(payload?: gmail_v1.Schema$MessagePart): string {
    if (!payload) return '';
    
    if (payload.parts) {
      return payload.parts
        .map(part => this.decodeBody(part))
        .join('\n');
    }

    if (payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64')
        .toString('utf-8');
    }

    return '';
  }

  private static extractAmount(body: string): number | undefined {
    const amountMatch = body.match(/\$\s*(\d+(\.\d{2})?)/);
    return amountMatch ? parseFloat(amountMatch[1]) : undefined;
  }
}

// Implement email message parsing with amount extraction