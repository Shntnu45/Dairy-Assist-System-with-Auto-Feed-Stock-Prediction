import { useState } from 'react';
import { chatbotService } from '../../services/chatbotService';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Dairy Assist assistant. I can help you with product questions, order status, payment help, and system guidance. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = {
    'order': 'You can track your order by going to "My Orders" section in your dashboard. Click on any order to see its current status and delivery details.',
    'payment': 'We accept all major payment methods through Razorpay. Your payments are secure. You can view your payment history in the "Payments" section.',
    'product': 'Browse our wide range of fresh dairy products including milk, cheese, butter, yogurt, and more. Add items to your cart and proceed to checkout.',
    'delivery': 'We deliver fresh dairy products to your doorstep. Delivery time is usually 1-2 days. You can track your order status in the Orders section.',
    'cart': 'You can add products to your cart, update quantities, and remove items. Go to the Cart section to review your items before checkout.',
    'profile': 'You can manage your profile, update your name and phone, change password, and manage delivery addresses in the Profile section.',
    'address': 'You can add multiple delivery addresses in your profile. Select an address during checkout. Addresses can be managed in your Profile section.',
    'help': 'I can help with: Product questions, Order tracking, Payment information, Delivery status, Cart management, Profile settings, and Address management. Just ask me!'
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend chatbot API
      const botResponse = await chatbotService.askChatbot(currentInput) || generateBotResponse(currentInput.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        text: typeof botResponse === 'string' ? botResponse : JSON.stringify(botResponse),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Fallback to local response if API fails
      const botResponse = generateBotResponse(currentInput.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (input) => {
    // Simple keyword matching for fallback
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (input.includes(keyword)) {
        return response;
      }
    }

    // Default responses for common queries
    if (input.includes('track') || input.includes('status')) {
      return 'You can track your order status in the "My Orders" section. Each order shows its current delivery status.';
    }

    if (input.includes('how') || input.includes('what')) {
      return 'I can explain how to use different features of Dairy Assist. Please specify what you\'d like to know: orders, payments, products, or account management.';
    }

    return 'I\'m here to help! You can ask me about products, orders, payments, delivery, cart, profile, or addresses. Could you please be more specific?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="user-chatbot">
      <div className="page-header">
        <h1>AI Assistant</h1>
        <p>Get help with products, orders, payments, and more (Read-only)</p>
      </div>

      <div className="chatbot-container">
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about products, orders, payments, or delivery..."
          />
          <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            Send
          </button>
        </div>
      </div>

      <div className="chatbot-info">
        <h3>What I can help with:</h3>
        <div className="help-topics">
          <div className="help-topic">
            <span className="topic-icon">🥛</span>
            <span>Product information and browsing</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">📦</span>
            <span>Order tracking and status</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">💳</span>
            <span>Payment methods and history</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">🚚</span>
            <span>Delivery information</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">🛒</span>
            <span>Cart management</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">👤</span>
            <span>Profile and address management</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
