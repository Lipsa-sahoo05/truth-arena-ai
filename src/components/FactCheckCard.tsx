import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ExternalLink, Shield, Zap, TrendingUp } from "lucide-react";

interface FactCheck {
  id: string;
  claim: string;
  verdict: "true" | "false" | "mixed" | "unverified";
  sources: string[];
  confidence: number;
  timestamp: Date;
}

interface FactCheckCardProps {
  factCheck: FactCheck;
}

const FactCheckCard = ({ factCheck }: FactCheckCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getVerdictConfig = (verdict: FactCheck["verdict"]) => {
    switch (verdict) {
      case "true":
        return {
          icon: <Shield className="h-4 w-4" />,
          label: "Verified True",
          color: "text-verdict-true",
          bgColor: "bg-verdict-true/10",
          borderColor: "border-verdict-true/20",
        };
      case "false":
        return {
          icon: <Shield className="h-4 w-4" />,
          label: "Disputed",
          color: "text-verdict-false",
          bgColor: "bg-verdict-false/10",
          borderColor: "border-verdict-false/20",
        };
      case "mixed":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          label: "Partially True",
          color: "text-verdict-mixed",
          bgColor: "bg-verdict-mixed/10",
          borderColor: "border-verdict-mixed/20",
        };
      case "unverified":
        return {
          icon: <Zap className="h-4 w-4" />,
          label: "Unverified",
          color: "text-verdict-unverified",
          bgColor: "bg-verdict-unverified/10",
          borderColor: "border-verdict-unverified/20",
        };
    }
  };

  const verdictConfig = getVerdictConfig(factCheck.verdict);
  const confidencePercentage = Math.round(factCheck.confidence * 100);

  return (
    <Card className={`bg-card/50 backdrop-blur-md border ${verdictConfig.borderColor} 
                      shadow-glass hover:shadow-glow/20 transition-all duration-300 animate-slide-up`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between space-x-2">
          <Badge 
            className={`${verdictConfig.bgColor} ${verdictConfig.color} ${verdictConfig.borderColor} 
                       border animate-glow-pulse`}
          >
            {verdictConfig.icon}
            <span className="ml-1">{verdictConfig.label}</span>
          </Badge>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>{confidencePercentage}%</span>
            </div>
            <span>•</span>
            <span>{factCheck.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Claim Analysis</h4>
            <p className="text-sm text-foreground/90 leading-relaxed">
              "{factCheck.claim}"
            </p>
          </div>

          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-xs p-2 h-auto hover:bg-primary/5"
              >
                <span>View Sources ({factCheck.sources.length})</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="animate-accordion-down">
              <div className="mt-3 space-y-2">
                {factCheck.sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border/50 
                               hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs text-foreground/80 truncate flex-1">
                      {source}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-1 ml-2 hover:bg-primary/10"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Confidence Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className={verdictConfig.color}>{confidencePercentage}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 animate-glow-pulse`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FactCheckCard;