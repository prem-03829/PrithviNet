export const aiService = {
  sendMessage: async (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          role: 'ai',
          content: `I've analyzed the geospatial data for "${message}". The indices show a moderate correlation with recent industrial activity. Would you like me to generate a detailed NDVI breakdown for the region?`,
        });
      }, 1000);
    });
  }
};
