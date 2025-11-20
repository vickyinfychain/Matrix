const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // User APIs
  async registerUser(walletAddress, sponsorUserId = null) {
    return this.request("/users/register", {
      method: "POST",
      body: { walletAddress, sponsorUserId },
    });
  }

  async getUserByWallet(walletAddress) {
    return this.request(`/users/by-wallet/${walletAddress}`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  // Slot APIs
  async getSlots() {
    return this.request("/slots");
  }

  async activateSlot(walletAddress, slotNumber) {
    return this.request("/slots/activate", {
      method: "POST",
      body: { walletAddress, slotNumber },
    });
  }

  // Tree APIs
  async getUserTree(slotNumber, userId) {
    return this.request(`/tree/${slotNumber}/${userId}`);
  }

  // Dashboard APIs
  async getDashboard(userId) {
    return this.request(`/dashboard/${userId}`);
  }

  async getEarnings(userId, limit = 50) {
    return this.request(`/dashboard/${userId}/earnings?limit=${limit}`);
  }

  // Debug APIs
  async getDebugUsers() {
    return this.request("/debug/users");
  }

  async getDebugPositions() {
    return this.request("/debug/positions");
  }
}

export const apiService = new ApiService();