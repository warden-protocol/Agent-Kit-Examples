class NebulaApiService {
    private sessionId: string | null = null;
    private readonly API_URL = "https://nebula-api.thirdweb.com";
    private readonly THIRDWEB_SECRET_KEY: string;
    private readonly THIRDWEB_CLIENT_ID: string;
  
    constructor() {
      if (!process.env.THIRDWEB_SECRET_KEY) {
        throw new Error("THIRDWEB_SECRET_KEY is required");
      }
      if (!process.env.THIRDWEB_CLIENT_ID) {
        throw new Error("THIRDWEB_CLIENT_ID is required");
      }
      
      this.THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
      this.THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;
    }
  
    async initialize() {
      if (this.sessionId) return;
  
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          "x-secret-key": this.THIRDWEB_SECRET_KEY
        };
  
        const response = await fetch(`${this.API_URL}/session`, {
          method: "POST",
          headers,
          body: "{}"
        });
  
        if (!response.ok) {
          throw new Error(`Failed to initialize session: ${response.statusText}`);
        }
  
        const data = await response.json();
        this.sessionId = data.result.id;
        console.log(
          "Initialized thirdweb nebula api service with session:",
          this.sessionId
        );
      } catch (error) {
        console.error("Failed to initialize thirdweb nebula api service:", error);
        throw error;
      }
    }
  
    async processChat(message: string) {
      if (!this.sessionId) {
        await this.initialize();
      }
  
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-secret-key": this.THIRDWEB_SECRET_KEY
      };
  
      const response = await fetch(`${this.API_URL}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          user_id: "default-user",
          stream: false,
          session_id: this.sessionId,
        })
      });
  
      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data?.message;
    }
  }
  
  export const nebulaService = new NebulaApiService();