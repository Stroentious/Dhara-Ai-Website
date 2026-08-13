import React, { useState } from 'react';
import { ChatWindow } from '../components/chatbot/ChatWindow';
import { farmService } from '../services/farmService';

export const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am **Dhara AI**, your intelligent agricultural assistant.\n\nI monitor soil telemetry across all Field Poles (N, P, K, pH, EC, Moisture, Temperature) and assist with irrigation control decisions.\n\nHow can I help you manage your farm today?',
      timestamp: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const replyText = await farmService.sendChatMessage(text);
      const assistantMsg = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
