// src/services/email/types.ts
export interface EmailRequest {
    id: string;
    from: string;
    subject: string;
    body: string;
    amount?: number;
    timestamp: Date;
}

export interface SendTokenInput {
    recipient: string;
    amount: number;
    keyId: number;
}