import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, X } from "lucide-react";

interface ModerationAlertProps {
  type: "warning" | "error";
  message: string;
  onClose: () => void;
}

const ModerationAlert = ({ type, message, onClose }: ModerationAlertProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-dismiss after 5 seconds for warnings
    if (type === "warning") {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow animation to complete
  };

  const getAlertConfig = () => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          textColor: "text-warning",
          glowColor: "shadow-warning/20",
        };
      case "error":
        return {
          icon: <Shield className="h-5 w-5" />,
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          textColor: "text-destructive",
          glowColor: "shadow-destructive/20",
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className={`p-4 w-80 ${config.bgColor} ${config.borderColor} border-2 
                        backdrop-blur-md shadow-glass hover:${config.glowColor} 
                        transition-all duration-300 animate-slide-up`}>
        <div className="flex items-start space-x-3">
          <div className={`${config.textColor} animate-glow-pulse`}>
            {config.icon}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-semibold text-sm ${config.textColor} mb-1`}>
              {type === "warning" ? "Moderation Notice" : "Content Blocked"}
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {message}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-1 hover:bg-muted/50"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {type === "warning" && (
          <div className="mt-3 w-full bg-muted/20 rounded-full h-0.5">
            <div 
              className={`h-0.5 rounded-full ${config.textColor} bg-current`}
              style={{
                width: "100%",
                animation: "shrinkBar 5s linear forwards"
              }}
            />
          </div>
        )}
      </Card>
      
      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ModerationAlert;