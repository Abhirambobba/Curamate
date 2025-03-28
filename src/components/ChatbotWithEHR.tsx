
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Plus, Edit } from 'lucide-react';
import EHRForm from './EHRForm';
import { Patient, EHR, loadEHRs, saveEHRs } from '@/utils/csvUtils';
import { getAuthUser } from '@/utils/authUtils';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotWithEHRProps {
  patient: Patient;
}

// Enhanced healthcare responses that can reference EHR data
const generateResponse = (input: string, patientName: string, ehrData: EHR[] | null): string => {
  const lowercaseInput = input.toLowerCase();
  
  // If no EHR data is available
  if (!ehrData || ehrData.length === 0) {
    if (lowercaseInput.includes('ehr') || 
        lowercaseInput.includes('record') || 
        lowercaseInput.includes('medical history') ||
        lowercaseInput.includes('diagnosis')) {
      return `I don't see any electronic health records for ${patientName}. The doctor may want to create a new EHR.`;
    }
  } else {
    // Reference EHR data in responses
    const latestEHR = ehrData[0]; // Assuming ehrData is sorted newest first
    
    if (lowercaseInput.includes('diagnosis') || lowercaseInput.includes('what is wrong')) {
      return `According to the latest EHR (${latestEHR.date}), the diagnosis is: ${latestEHR.diagnosis}`;
    }
    
    if (lowercaseInput.includes('medication') || lowercaseInput.includes('prescription')) {
      return latestEHR.prescription 
        ? `According to the latest EHR (${latestEHR.date}), the prescription is: ${latestEHR.prescription}`
        : `There is no prescription information in the latest EHR (${latestEHR.date}).`;
    }
    
    if (lowercaseInput.includes('follow') || lowercaseInput.includes('next appointment')) {
      return latestEHR.followUp
        ? `According to the latest EHR (${latestEHR.date}), follow-up recommended in: ${latestEHR.followUp}`
        : `There is no follow-up information in the latest EHR (${latestEHR.date}).`;
    }
    
    if (lowercaseInput.includes('history') || lowercaseInput.includes('records') || lowercaseInput.includes('ehr')) {
      return `${patientName} has ${ehrData.length} EHR records. The latest one is from ${latestEHR.date} with diagnosis: ${latestEHR.diagnosis}`;
    }
  }
  
  // Default responses for other topics
  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
    return `Hello! I'm your healthcare assistant. I can help you with information about ${patientName}'s medical records. How can I assist you today?`;
  }
  
  if (lowercaseInput.includes('help')) {
    return `I can help with information about ${patientName}'s medical records, answer questions about common conditions, or assist with using the platform. What do you need help with?`;
  }
  
  // Default response
  return `I'm here to assist with ${patientName}'s medical information. Could you please rephrase your question?`;
};

const ChatbotWithEHR: React.FC<ChatbotWithEHRProps> = ({ patient }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: `Hello! I'm your healthcare assistant for ${patient.name}. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'ehr'>('chat');
  const [ehrData, setEhrData] = useState<EHR[]>([]);
  const [selectedEHR, setSelectedEHR] = useState<string | null>(null);
  const [isNewEHROpen, setIsNewEHROpen] = useState(false);
  const [isEditEHROpen, setIsEditEHROpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Load EHRs for this patient
    const fetchedEHRs = loadEHRs();
    const patientEHRs = fetchedEHRs.filter(ehr => ehr.patientId === patient.id);
    
    // Sort by date (newest first)
    patientEHRs.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    setEhrData(patientEHRs);
  }, [patient.id]);
  
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
        content: generateResponse(input, patient.name, ehrData.length > 0 ? ehrData : null),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const handleEHRCreated = () => {
    // Reload EHRs
    const fetchedEHRs = loadEHRs();
    const patientEHRs = fetchedEHRs.filter(ehr => ehr.patientId === patient.id);
    
    // Sort by date (newest first)
    patientEHRs.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    setEhrData(patientEHRs);
    setIsNewEHROpen(false);
    setIsEditEHROpen(false);
    
    // Add system message about new/updated EHR
    const systemMessage: Message = {
      role: 'bot',
      content: `Electronic Health Record has been ${selectedEHR ? 'updated' : 'created'} for ${patient.name}.`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-healthcare-blue" />
            Healthcare Assistant - {patient.name}
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
      
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Electronic Health Records</CardTitle>
          <Dialog open={isNewEHROpen} onOpenChange={setIsNewEHROpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> New EHR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New EHR for {patient.name}</DialogTitle>
              </DialogHeader>
              <EHRForm patient={patient} onSave={handleEHRCreated} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          {ehrData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-healthcare-gray mb-4">No health records found for this patient.</p>
              <Button onClick={() => setIsNewEHROpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create First Health Record
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Tabs defaultValue={ehrData[0].id}>
                <TabsList className="w-full flex mb-4 overflow-x-auto">
                  {ehrData.map((ehr, index) => (
                    <TabsTrigger key={ehr.id} value={ehr.id} className="flex-shrink-0">
                      {ehr.date} {index === 0 && "(Latest)"}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {ehrData.map((ehr) => (
                  <TabsContent key={ehr.id} value={ehr.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Medical Record - {ehr.date}</h3>
                      <Dialog 
                        open={isEditEHROpen && selectedEHR === ehr.id} 
                        onOpenChange={(open) => {
                          setIsEditEHROpen(open);
                          if (open) {
                            setSelectedEHR(ehr.id);
                          } else {
                            setSelectedEHR(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit EHR for {patient.name}</DialogTitle>
                          </DialogHeader>
                          <EHRForm 
                            patient={patient} 
                            ehrId={ehr.id} 
                            onSave={handleEHRCreated} 
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-healthcare-gray">Diagnosis</h4>
                      <p className="mt-1">{ehr.diagnosis}</p>
                    </div>
                    
                    {ehr.prescription && (
                      <div>
                        <h4 className="text-sm font-medium text-healthcare-gray">Prescription</h4>
                        <p className="mt-1 whitespace-pre-line">{ehr.prescription}</p>
                      </div>
                    )}
                    
                    {ehr.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-healthcare-gray">Clinical Notes</h4>
                        <p className="mt-1 whitespace-pre-line">{ehr.notes}</p>
                      </div>
                    )}
                    
                    {ehr.followUp && (
                      <div>
                        <h4 className="text-sm font-medium text-healthcare-gray">Follow-up</h4>
                        <p className="mt-1">{ehr.followUp}</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotWithEHR;
