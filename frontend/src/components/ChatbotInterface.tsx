import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

const ChatbotInterface: React.FC = () => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-healthcare-blue" />
          CuraMate Healthcare Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0">
        <div className="flex h-full">
          <div className="w-full h-[800px]">
            <iframe
              src="http://localhost:8501"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: "none", borderRadius: "10px" }}
            />
          </div>

        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <ScrollArea className="h-[200px] px-4">
          <p className="text-gray-500">✨ Powered by CuraMate's AI-Driven Medical Assistant</p>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
};

export default ChatbotInterface;
