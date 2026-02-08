import { useState } from 'react';
import './AdminChatbot.css';

const AdminChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your admin assistant. I can help you with system information, reports, and answer questions about orders, payments, and feed management. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses = {
    'orders': 'I can help you with order-related queries. You can ask about order status, recent orders, or order statistics.',
    'payments': 'For payment information, I can provide details about transaction status, payment methods, and revenue reports.',
    'feed': 'I can assist with feed management queries including stock levels, consumption patterns, and reorder alerts.',
    'users': 'I can provide information about user registrations, active users, and user activity statistics.',
    'reports': 'I can help explain various reports available in the system including sales reports, feed analytics, and user activity reports.',
    'system': 'I can provide information about system status, recent activities, and general system usage.',
    'help': 'I can assist with: Orders, Payments, Feed Management, User Information, Reports, and System Status. Just ask me about any of these topics!'
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
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage.toLowerCase());
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (input) => {
    // Simple keyword matching for demo purposes
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (input.includes(keyword)) {
        return response;
      }
    }

    // Default responses for common queries
    if (input.includes('status') || input.includes('overview')) {
      return 'I can provide system status information. The admin dashboard shows current statistics for users, orders, payments, and feed management. Would you like specific information about any of these areas?';
    }

    if (input.includes('how') || input.includes('what')) {
      return 'I can explain how different parts of the system work. Please specify what you\'d like to know more about: orders, payments, feed management, or user management.';
    }

    return 'I understand you\'re asking about the system. I can help with information about orders, payments, feed management, users, and reports. Could you please be more specific about what you\'d like to know?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="admin-chatbot">
      <div className="page-header">
        <h1>AI Assistant</h1>
        <p>Get help with system information and reports (Read-only)</p>
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
            placeholder="Ask me about orders, payments, feed management, or reports..."
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
            <span className="topic-icon">📦</span>
            <span>Order status and statistics</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">💳</span>
            <span>Payment information and reports</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">🌾</span>
            <span>Feed management and analytics</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">👥</span>
            <span>User activity and statistics</span>
          </div>
          <div className="help-topic">
            <span className="topic-icon">📊</span>
            <span>System reports and insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatbot;