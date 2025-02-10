export interface EmailRequest {
    id: string;
    from: string;
    subject: string;
    body: string;
    amount?: number;
    timestamp: Date;
}

export interface SpaceKey {
    id: number;
    spaceId: number;
    createdAt: string;
}

export interface PaymentResult {
    success: boolean;
    transactionHash?: string;
    error?: string;
} 