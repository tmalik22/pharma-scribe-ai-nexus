
import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI research assistant. I can help you search through pharmaceutical research papers, find relevant studies, and analyze research trends. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand you\'re looking for information about pharmaceutical research. Once connected to the backend database, I\'ll be able to search through thousands of research papers and provide detailed insights. For now, this is a demo response.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-6 border-b bg-white">
        <h2 className="text-2xl font-bold text-gray-900">AI Research Assistant</h2>
        <p className="text-gray-600 mt-1">Ask questions about pharmaceutical research papers</p>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`flex-1 p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white ml-auto max-w-md' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-green-100">
                <Bot size={20} />
              </div>
              <div className="flex-1 p-4 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" size={16} />
                  <p className="text-sm text-gray-600">AI is thinking...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t bg-white">
        <div className="flex space-x-4 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pharmaceutical research papers..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
