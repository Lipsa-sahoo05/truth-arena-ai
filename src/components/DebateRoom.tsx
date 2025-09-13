import { useState, useEffect, useRef } from "react";
import { Send, Users, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ChatWindow from "./ChatWindow";
import FactCheckCard from "./FactCheckCard";
import ModerationAlert from "./ModerationAlert";

interface DebateRoomProps {
  roomId: string;
  topic: string;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  status: "pending" | "approved" | "flagged";
}

interface FactCheck {
  id: string;
  claim: string;
  verdict: "true" | "false" | "mixed" | "unverified";
  sources: string[];
  confidence: number;
  timestamp: Date;
}

const DebateRoom = ({ roomId, topic }: DebateRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [factChecks, setFactChecks] = useState<FactCheck[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState(42);
  const [isConnected, setIsConnected] = useState(false);
  const [moderationAlert, setModerationAlert] = useState<{
    type: "warning" | "error";
    message: string;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate connection to real-time service
    setIsConnected(true);
    
    // Demo messages
    const demoMessages: Message[] = [
      {
        id: "1",
        userId: "user1",
        username: "AIEthicist",
        content: "I believe AI should have transparent decision-making processes in all public applications.",
        timestamp: new Date(Date.now() - 300000),
        status: "approved"
      },
      {
        id: "2", 
        userId: "user2",
        username: "TechRealist",
        content: "While transparency is ideal, some AI systems are too complex for full human understanding.",
        timestamp: new Date(Date.now() - 240000),
        status: "approved"
      }
    ];

    const demoFactChecks: FactCheck[] = [
      {
        id: "fc1",
        claim: "AI systems are too complex for full human understanding",
        verdict: "mixed",
        sources: ["Nature AI Research 2024", "MIT Technology Review", "IEEE Spectrum"],
        confidence: 0.75,
        timestamp: new Date(Date.now() - 180000)
      }
    ];

    setMessages(demoMessages);
    setFactChecks(demoFactChecks);
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: "current-user",
      username: "You",
      content: newMessage,
      timestamp: new Date(),
      status: "pending"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate moderation check
    if (newMessage.toLowerCase().includes("toxic")) {
      setTimeout(() => {
        setModerationAlert({
          type: "warning",
          message: "Your message is being reviewed for community guidelines compliance."
        });
        setMessages(prev => prev.map(m => 
          m.id === message.id ? {...m, status: "flagged"} : m
        ));
      }, 1000);
    } else {
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? {...m, status: "approved"} : m
        ));
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Neural Network Background Effect */}
      <div className="fixed inset-0 bg-gradient-primary opacity-5 animate-neural-pulse" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary animate-glow-pulse" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Digital Public Square
                </h1>
              </div>
              <div className="hidden md:block h-6 w-px bg-border" />
              <h2 className="hidden md:block text-lg font-semibold text-foreground/80">
                {topic}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{participants} active</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${isConnected ? 'text-success' : 'text-destructive'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'} animate-neural-pulse`} />
                <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[70vh] bg-card/50 backdrop-blur-md border-border shadow-glass">
              <div className="flex flex-col h-full">
                <ChatWindow 
                  messages={messages}
                  messagesEndRef={messagesEndRef}
                />
                
                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share your perspective..."
                      className="flex-1 bg-input/50 border-border focus:ring-primary focus:border-primary"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Fact Check Panel */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-accent animate-glow-pulse" />
              <h3 className="text-lg font-semibold">AI Fact Checks</h3>
            </div>
            
            <div className="space-y-4">
              {factChecks.map((factCheck) => (
                <FactCheckCard key={factCheck.id} factCheck={factCheck} />
              ))}
              
              {factChecks.length === 0 && (
                <Card className="p-6 bg-card/30 backdrop-blur-md border-border text-center">
                  <p className="text-muted-foreground">
                    AI fact-checking will appear here as claims are analyzed
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Alert */}
      {moderationAlert && (
        <ModerationAlert
          type={moderationAlert.type}
          message={moderationAlert.message}
          onClose={() => setModerationAlert(null)}
        />
      )}
    </div>
  );
};

export default DebateRoom;