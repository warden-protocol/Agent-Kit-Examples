// src/utils/validation.ts
export function validateEmailDomain(email: string): boolean {
    // Extract domain from email
    const domain = email.match(/@([\w.]+)/)?.[1];
    return domain === 'wardenprotocol.org';  // Your organization domain
}