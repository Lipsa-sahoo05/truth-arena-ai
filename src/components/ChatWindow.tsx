import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  status: "pending" | "approved" | "flagged";
}

interface ChatWindowProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatWindow = ({ messages, messagesEndRef }: ChatWindowProps) => {
  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3 text-success" />;
      case "pending":
        return <Clock className="h-3 w-3 text-warning animate-spin" />;
      case "flagged":
        return <AlertTriangle className="h-3 w-3 text-destructive" />;
    }
  };

  const getStatusColor = (status: Message["status"]) => {
    switch (status) {
      case "approved":
        return "border-success/20 bg-success/5";
      case "pending":
        return "border-warning/20 bg-warning/5";
      case "flagged":
        return "border-destructive/20 bg-destructive/5";
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex space-x-3 animate-slide-up ${getStatusColor(message.status)} 
                         rounded-lg p-3 border transition-all duration-300 hover:shadow-glow/20`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-secondary text-xs font-medium">
                  {message.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-foreground">
                      {message.username}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-primary/20 bg-primary/5 text-primary"
                    >
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {getStatusIcon(message.status)}
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-foreground/90 leading-relaxed">
                  {message.content}
                </p>
                
                {message.status === "flagged" && (
                  <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                    This message is under review for community guidelines compliance.
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatWindow;