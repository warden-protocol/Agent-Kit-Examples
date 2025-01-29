interface RequestRecord {
    email: string;
    timestamp: Date;
    amount: number;
}
  
export class Database {
    private requests: RequestRecord[] = [];
  
    async canRequestPayment(email: string): Promise<boolean> {
      const lastRequest = this.requests
        .filter(r => r.email === email)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  
      if (!lastRequest) return true;
  
      // Changed from 24 hours to 5 minutes
      const minutesSinceLastRequest = 
        (Date.now() - lastRequest.timestamp.getTime()) / (1000 * 60);
      
      return minutesSinceLastRequest >= 5; // 5 minutes cooldown
    }
    
    async recordRequest(email: string, amount: number) {
        this.requests.push({
          email,
          amount,
          timestamp: new Date()
        });
    }
}
  