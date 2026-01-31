const API_BASE_URL =
  "https://deropxyz-ac02-ml.hf.space";

export const mlApi = {
  async predict(sensorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensorData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Prediction error:", error);
      throw error;
    }
  },

  async predictBatchCSV(csvFile) {
    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await fetch(`${API_BASE_URL}/predict/batch`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Return blob for CSV download
      return await response.blob();
    } catch (error) {
      console.error("Batch prediction error:", error);
      throw error;
    }
  },

  async predictBatchJSON(csvFile) {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    try {
      const response = await fetch(`${API_BASE_URL}/predict/batch/json`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Batch prediction error:', error);
      throw error;
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  async getModelInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/model/info`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Model info error:', error);
      throw error;
    }
  }
};
