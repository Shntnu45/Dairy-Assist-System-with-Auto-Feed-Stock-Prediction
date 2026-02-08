import api from './api';

export const chatbotService = {
  // Send query to chatbot - backend: POST /api/chatbot/query?query=...
  askChatbot: async (query) => {
    const response = await api.post(`/chatbot/query?query=${encodeURIComponent(query)}`);
    return response.data || 'I apologize, but I couldn\'t process your request at the moment.';
  },

  // Get FAQs - backend: GET /api/chatbot/faqs
  getFaqs: async () => {
    const response = await api.get('/chatbot/faqs');
    return response.data || [];
  }
};
