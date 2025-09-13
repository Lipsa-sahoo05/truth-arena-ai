import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Zap, MessageSquare, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeDebates] = useState([
    {
      id: "ai-transparency",
      topic: "Should AI Systems Be Required to Provide Transparent Decision-Making?",
      participants: 42,
      messages: 156,
      status: "active" as const
    },
    {
      id: "climate-tech", 
      topic: "Can Technology Solve Climate Change Without Policy Changes?",
      participants: 31,
      messages: 89,
      status: "active" as const
    },
    {
      id: "privacy-security",
      topic: "Digital Privacy vs. National Security: Finding the Balance", 
      participants: 28,
      messages: 67,
      status: "active" as const
    },
    {
      id: "automation-jobs",
      topic: "Will Automation Create More Jobs Than It Eliminates?",
      participants: 19,
      messages: 34,
      status: "starting" as const
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Neural Network Background */}
      <div className="fixed inset-0 bg-gradient-primary opacity-5 animate-neural-pulse" />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Brain className="h-16 w-16 text-primary animate-glow-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Digital Public Square
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-powered democratic discourse with real-time fact-checking, 
            intelligent moderation, and transparent decision-making
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              AI Fact-Checking
            </Badge>
            <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Smart Moderation
            </Badge>
            <Badge className="bg-success/10 text-success border-success/20 px-4 py-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Real-time Analytics
            </Badge>
          </div>
        </div>
      </section>

      {/* Active Debates */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Join the Conversation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {activeDebates.map((debate) => (
              <Card 
                key={debate.id}
                className="bg-card/50 backdrop-blur-md border-border shadow-glass hover:shadow-glow/20 
                          transition-all duration-300 hover:scale-105 animate-slide-up"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight pr-4">
                      {debate.topic}
                    </CardTitle>
                    <Badge 
                      className={`${
                        debate.status === 'active' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-warning/10 text-warning border-warning/20'
                      } animate-glow-pulse`}
                    >
                      {debate.status === 'active' ? 'Live' : 'Starting'}
                    </Badge>
                  </div>
                  
                  <CardDescription className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{debate.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{debate.messages} messages</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Link to={`/debate/${debate.id}`}>
                    <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                      Join Debate
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powered by AI Innovation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center animate-glow-pulse">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Fact Checking</h3>
              <p className="text-muted-foreground">
                AI analyzes claims instantly using retrieval-augmented generation 
                with verified knowledge sources
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full mx-auto flex items-center justify-center animate-neural-pulse">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Intelligent Moderation</h3>
              <p className="text-muted-foreground">
                Advanced toxicity detection maintains respectful discourse 
                while preserving free expression
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-glow rounded-full mx-auto flex items-center justify-center animate-glow-pulse">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Democratic AI</h3>
              <p className="text-muted-foreground">
                Transparent algorithms ensure AI decisions are explainable 
                and aligned with democratic values
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
