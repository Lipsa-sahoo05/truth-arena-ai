// API Service for FastAPI Backend Integration

interface ModerationResult {
  is_toxic: boolean;
  confidence: number;
  categories: string[];
  message: string;
}

interface FactCheckResult {
  claim: string;
  verdict: 'true' | 'false' | 'mixed' | 'unverified';
  sources: string[];
  confidence: number;
  explanation: string;
}

interface SummaryResult {
  summary: string;
  key_points: string[];
  participants: number;
  duration_minutes: number;
}

// FastAPI Backend Configuration
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

// n8n Workflow Webhooks
const N8N_WEBHOOKS = {
  moderation: process.env.VITE_N8N_MODERATION_WEBHOOK || 'http://localhost:5678/webhook/moderation',
  factcheck: process.env.VITE_N8N_FACTCHECK_WEBHOOK || 'http://localhost:5678/webhook/factcheck'
};

export class APIService {
  // Content Moderation
  static async moderateContent(content: string): Promise<ModerationResult> {
    try {
      // Option 1: Direct FastAPI call
      const response = await fetch(`${API_BASE_URL}/api/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error(`Moderation API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Moderation service error:', error);
      
      // Fallback: Trigger n8n workflow
      return this.triggerModerationWorkflow(content);
    }
  }

  // Fact Checking with RAG Pipeline
  static async factCheck(claim: string): Promise<FactCheckResult> {
    try {
      // Option 1: Direct FastAPI call
      const response = await fetch(`${API_BASE_URL}/api/factcheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ claim })
      });

      if (!response.ok) {
        throw new Error(`Fact-check API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fact-check service error:', error);
      
      // Fallback: Trigger n8n workflow
      return this.triggerFactCheckWorkflow(claim);
    }
  }

  // Debate Summarization
  static async summarizeDebate(debateId: string, messages: any[]): Promise<SummaryResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          debate_id: debateId,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Summary API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Summary service error:', error);
      throw error;
    }
  }

  // n8n Workflow Triggers
  private static async triggerModerationWorkflow(content: string): Promise<ModerationResult> {
    try {
      const response = await fetch(N8N_WEBHOOKS.moderation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          content,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`n8n moderation webhook error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('n8n moderation workflow error:', error);
      
      // Basic fallback moderation
      return {
        is_toxic: content.toLowerCase().includes('toxic'),
        confidence: 0.5,
        categories: [],
        message: 'Moderation service temporarily unavailable'
      };
    }
  }

  private static async triggerFactCheckWorkflow(claim: string): Promise<FactCheckResult> {
    try {
      const response = await fetch(N8N_WEBHOOKS.factcheck, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          claim,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`n8n fact-check webhook error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('n8n fact-check workflow error:', error);
      
      // Basic fallback response
      return {
        claim,
        verdict: 'unverified',
        sources: [],
        confidence: 0,
        explanation: 'Fact-checking service temporarily unavailable'
      };
    }
  }

  // Health checks
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  // WebSocket connection for real-time updates
  static connectWebSocket(debateId: string): WebSocket | null {
    try {
      const wsUrl = API_BASE_URL.replace('http', 'ws');
      const ws = new WebSocket(`${wsUrl}/ws/debate/${debateId}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected for debate:', debateId);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      return null;
    }
  }
}

export default APIService;