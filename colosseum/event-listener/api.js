class ChessApiClient {
  constructor(baseUrl = "http://127.0.0.1:6960") {
    this.baseUrl = baseUrl;
  }

  async makeMove(fromX, fromY, toX, toY) {
    let color = "black";
    try {
      // Validate input types before making the request
      if (
        !Number.isInteger(fromX) ||
        !Number.isInteger(fromY) ||
        !Number.isInteger(toX) ||
        !Number.isInteger(toY) ||
        typeof color !== "string"
      ) {
        throw new Error("Invalid parameter types");
      }

      fromY = 7 - fromY;
      toY = 7 - toY;

      const response = await fetch(`${this.baseUrl}/api/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromX,
          fromY,
          toX,
          toY,
          color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to make move");
      }

      return await response.json();
    } catch (error) {
      console.error("Error making move:", error.message);
      throw error;
    }
  }

  async startNewGame() {
    try {
      const response = await fetch(`${this.baseUrl}/api/game/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to make move");
      }

      return await response.json();
    } catch (error) {
      console.error("Error making move:", error.message);
      throw error;
    }
  }
}

export default ChessApiClient;
