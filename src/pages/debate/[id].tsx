import { useParams } from "react-router-dom";
import DebateRoom from "@/components/DebateRoom";

const DebatePage = () => {
  const { id } = useParams<{ id: string }>();
  
  // This would typically fetch debate details from your backend
  const debateTopics = {
    "ai-transparency": "Should AI Systems Be Required to Provide Transparent Decision-Making?",
    "climate-tech": "Can Technology Solve Climate Change Without Policy Changes?",
    "privacy-security": "Digital Privacy vs. National Security: Finding the Balance",
    "automation-jobs": "Will Automation Create More Jobs Than It Eliminates?",
  };
  
  const topic = debateTopics[id as keyof typeof debateTopics] || "General Discussion";
  
  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Debate Room Not Found</h1>
          <p className="text-muted-foreground">The requested debate room does not exist.</p>
        </div>
      </div>
    );
  }

  return <DebateRoom roomId={id} topic={topic} />;
};

export default DebatePage;