export interface Overview {
  totalMessages: number;
  totalWords: number;
  wordsPerMessage: number;
  sender1: {
    name: string;
    messages: number;
    words: number;
    wordsPerMessage: number;
  };
  sender2: {
    name: string;
    messages: number;
    words: number;
    wordsPerMessage: number;
  };
  avgMessagesPerDay: number;
  mostActiveDay: string;
  responseTime: string;
}

export interface TextAnalysis {
  commonWords: { word: string; count: number }[];
  sentimentScore: number;
  topEmojis: { emoji: string; count: number }[];
  wordCount: number;
  sender1: {
    name: string;
    commonWords: { word: string; count: number }[];
    topEmojis: { emoji: string; count: number }[];
  };
  sender2: {
    name: string;
    commonWords: { word: string; count: number }[];
    topEmojis: { emoji: string; count: number }[];
  };
}

export interface TimeAnalysis {
  mostActiveHour: number;
  mostActiveDay: string;
  mostActiveDate: string;
  mostMessagesCount: number;
  responsePattern: string;
  conversationLength: string;
  timeDistribution: { time: string; percentage: number }[];
  hourlyActivity: { hour: number; count: number }[];
  dailyActivity: { date: string; count: number }[];
  weekdayHourHeatmap: {
    day: string;
    hours: { hour: number; count: number }[];
  }[];
}

export interface AIInsights {
  personalityInsights: {
    sender1: {
      name: string;
      interestLevel: { score: number; detail: string };
      responseEnthusiasm: { score: number; detail: string };
      emotionalStability: { score: number; detail: string };
      responseTime: { score: number; detail: string };
    };
    sender2: {
      name: string;
      interestLevel: { score: number; detail: string };
      responseEnthusiasm: { score: number; detail: string };
      emotionalStability: { score: number; detail: string };
      responseTime: { score: number; detail: string };
    };
  };
  relationshipMetrics: {
    intimacy: { score: number; detail: string };
    communication: { score: number; detail: string };
    trust: { score: number; detail: string };
    conflict: { score: number; detail: string };
  };
  relationshipInsights?: {
    points: { title: string; description: string }[];
  };
  suggestedTopics?: string[];
  overallAnalysis?: {
    messageTips?: string[];
  };
}

export interface AnalysisData {
  id?: string;
  startDate: string;
  duration: number;
  endDate: string;
  timespanSummary: string;
  overview: Overview;
  textAnalysis: TextAnalysis;
  timeAnalysis: TimeAnalysis;
  aiInsights?: AIInsights;
}
