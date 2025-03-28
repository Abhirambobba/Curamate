
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Simple healthcare-related responses for the mock AI
const healthcareResponses: Record<string, string> = {
  "hello": "Hello! I'm your healthcare assistant. How can I help you today?",
  "hi": "Hi there! How can I assist you with your healthcare needs today?",
  "help": "I can help with general medical information, answer questions about common conditions, or assist with using the platform. What do you need help with?",
  "fever": "Fever can be a symptom of many conditions. It's generally defined as a temperature above 38°C (100.4°F). If the fever is high or persistent, it's important to consult with a healthcare professional.",
  "headache": "Headaches can have many causes, from stress to dehydration. For mild headaches, rest, hydration, and over-the-counter pain relievers might help. If you experience severe or recurring headaches, please consult with a doctor.",
  "cold": "Common cold symptoms include runny nose, sore throat, cough, and mild fever. Rest, hydration, and over-the-counter cold medications can help manage symptoms. If symptoms worsen or last longer than 10 days, consult a doctor.",
  "appointment": "You can book an appointment through the 'Book Appointment' section in your patient dashboard. Select a doctor, choose an available date and time, and provide a reason for your visit.",
  "medicine": "I cannot prescribe medications. Only licensed healthcare professionals can prescribe medicine based on your specific condition. Please consult with your doctor for medication advice.",
  "emergency": "If you're experiencing a medical emergency such as severe chest pain, difficulty breathing, or severe bleeding, please call emergency services (911) immediately.",
  "covid": "Common COVID-19 symptoms include fever, cough, fatigue, and loss of taste or smell. If you suspect you have COVID-19, get tested and follow isolation guidelines. Contact your healthcare provider if symptoms are severe.",
};

// Function to generate a response based on user input
const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for known keywords
  for (const [key, response] of Object.entries(healthcareResponses)) {
    if (lowercaseInput.includes(key)) {
      return response;
    }
  }
  
  // Default response
  return "I'm not sure I understand. Could you please rephrase your question? As a healthcare assistant, I can answer general health questions or help you navigate the platform.";
};

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hello! I'm your healthcare assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const botMessage: Message = {
        role: 'bot',
        content: generateResponse(input),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-healthcare-blue" />
          Healthcare Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-4 pt-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-healthcare-blue text-white'
                      : 'bg-healthcare-light-purple text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-healthcare-light-purple text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatbotInterface;
