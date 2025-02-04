import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { EMAIL_CONFIG } from '../../config/email';
import { CONSTANTS } from '../../config/constants';

export class EmailService {
    private gmail: any;
    private userId = 'me';

    private constructor(auth: any) {
        this.gmail = google.gmail({ version: 'v1', auth });
    }

    static async initialize(): Promise<EmailService> {
        try {
            const auth = await authenticate({
                keyfilePath: EMAIL_CONFIG.CREDENTIALS_PATH,
                scopes: EMAIL_CONFIG.SCOPES
            });

            return new EmailService(auth);
        } catch (error) {
            console.error('Failed to initialize EmailService:', error);
            throw error;
        }
    }

    async watchInbox(handler: (email: any) => Promise<void>): Promise<void> {
        console.log('Starting email monitoring...');

        setInterval(async () => {
            try {
                const messages = await this.fetchUnreadEmails();
                
                for (const message of messages) {
                    await handler(message);
                    await this.markAsRead(message.id);
                }
            } catch (error) {
                console.error('Error processing emails:', error);
            }
        }, CONSTANTS.EMAIL_POLL_INTERVAL);
    }

    private async fetchUnreadEmails() {
        const response = await this.gmail.users.messages.list({
            userId: this.userId,
            q: 'is:unread'
        });

        const messages = response.data.messages || [];
        const fullMessages = [];

        for (const message of messages) {
            const fullMessage = await this.gmail.users.messages.get({
                userId: this.userId,
                id: message.id
            });
            fullMessages.push(await this.parseMessage(fullMessage.data));
        }

        return fullMessages;
    }

    private async getAttachments(message: any): Promise<{data: Buffer, filename: string}[]> {
        const attachments: {data: Buffer, filename: string}[] = [];
        
        const parts = message.payload.parts || [];
        for (const part of parts) {
            if (part.filename && part.filename.toLowerCase().endsWith('.pdf')) {
                const attachment = await this.gmail.users.messages.attachments.get({
                    userId: this.userId,
                    messageId: message.id,
                    id: part.body.attachmentId
                });

                attachments.push({
                    data: Buffer.from(attachment.data.data, 'base64'),
                    filename: part.filename
                });
            }
        }

        return attachments;
    }

    private async parseMessage(message: any) {
        const headers = message.payload.headers;
        const attachments = await this.getAttachments(message);
        
        return {
            id: message.id,
            from: headers.find((h: any) => h.name === 'From')?.value,
            subject: headers.find((h: any) => h.name === 'Subject')?.value,
            body: this.getMessageBody(message.payload),
            attachments
        };
    }

    private getMessageBody(payload: any): string {
        if (payload.body.data) {
            return Buffer.from(payload.body.data, 'base64').toString();
        }

        if (payload.parts) {
            for (const part of payload.parts) {
                if (part.mimeType === 'text/plain') {
                    return Buffer.from(part.body.data, 'base64').toString();
                }
            }
        }

        return '';
    }

    private async markAsRead(messageId: string) {
        await this.gmail.users.messages.modify({
            userId: this.userId,
            id: messageId,
            requestBody: {
                removeLabelIds: ['UNREAD']
            }
        });
    }
} 