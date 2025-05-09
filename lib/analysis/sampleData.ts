import { AnalysisData } from "@/types/analysis";

/**
 * 生成示例分析数据（用于开发和测试）
 * @returns 示例分析数据
 */
export const generateSampleAnalysisData = (id: string = "sample"): AnalysisData => {
  return {
    id,
    startDate: "January 1, 2025",
    duration: 31,
    endDate: "January 31, 2025",
    timespanSummary: "Your story began on January 1, 2025 Thursday 00:00, unfolding over 31 days, until January 31, 2025 Friday 23:59—leaving an everlasting mark in the passage of time.",
    overview: {
      totalMessages: 1330,
      totalWords: 15243,
      wordsPerMessage: 11.46,
      sender1: {
        name: "John",
        messages: 900,
        words:14000 ,
        wordsPerMessage: 15.55
      },
      sender2: {
        name: "Emily",
        messages:430 ,
        words: 1243,
        wordsPerMessage: 2.89
      },
      avgMessagesPerDay: 15.3,
      mostActiveDay: "saturday",
      responseTime: "3 minutes"
    },
    textAnalysis: {
      commonWords: [
        { "word": "idc", "count": 32 },
          { "word": "literally", "count": 28 },
          { "word": "ugh", "count": 25 },
          { "word": "idk", "count": 22 },
          { "word": "seriously", "count": 20 },
          { "word": "lol", "count": 18 },
         { "word": "fr", "count": 16 },
          { "word": "no", "count": 14 },
         { "word": "drama", "count": 12 },
         { "word": "syd", "count": 10 },
         { "word": "pls",    "count": 45 },
         { "word": "thx",    "count": 38 },
         { "word": "ily",    "count": 35 },
        { "word": "omg",    "count": 30 },
         { "word": "ur",     "count": 28 },
        { "word": "babe",   "count": 25 },
         { "word": "sorry",    "count": 22 },
        { "word": "hmu",    "count": 20 },
        { "word": "ttyl",   "count": 18 },
        { "word": "brb",    "count": 15 }
      ],
      sentimentScore: 0.35,
      topEmojis: [
        {emoji: "❤️", count: 42},
        {emoji: "😊", count: 36},
        {emoji: "😘", count: 29},
        {emoji: "😍", count: 22},
        {emoji: "🥰", count: 18},
        {emoji: "👍", count: 15},
        {emoji: "😂", count: 14},
        {emoji: "🙏", count: 12},
        {emoji: "💕", count: 11},
        {emoji: "😁", count: 10}
      ],
      wordCount: 15243,
      sender1: {
        name: "Emily",
        commonWords: [
          { "word": "idc", "count": 32 },
          { "word": "literally", "count": 28 },
          { "word": "ugh", "count": 25 },
          { "word": "idk", "count": 22 },
          { "word": "seriously", "count": 20 },
          { "word": "lol", "count": 18 },
         { "word": "fr", "count": 16 },
          { "word": "no", "count": 14 },
         { "word": "drama", "count": 12 },
         { "word": "syd", "count": 10 }
        ],
        topEmojis: [
          { "emoji": "🙄", "count": 35 },
          { "emoji": "😒", "count": 32 },
          { "emoji": "😑", "count": 30 },
          { "emoji": "😤", "count": 28 },
          { "emoji": "🙅‍♀️", "count": 25 },
          { "emoji": "😾", "count": 22 },
          { "emoji": "👀", "count": 20 },
          { "emoji": "💅", "count": 18 },
          { "emoji": "🤨", "count": 15 },
          { "emoji": "🤦‍♀️", "count": 12 }
        ]
      },
      sender2: {
        name: "John",
        commonWords: [
          { "word": "pls",    "count": 245 },
          { "word": "sorry",    "count": 195 },
          { "word": "ttyl",   "count": 178 },
         { "word": "brb",    "count": 145 },
          { "word": "thx",    "count": 138 },
          { "word": "ily",    "count": 135 },
         { "word": "omg",    "count": 130 },
          { "word": "ur",     "count": 125 },
         { "word": "babe",   "count": 98 },
         { "word": "hmu",    "count": 90 }
        ],
        topEmojis: [
          { "emoji": "😢",  "count": 340 },
          { "emoji": "🙇‍♂️", "count": 330 },
          { "emoji": "🙏",  "count": 245 },
           { "emoji": "🥀",  "count": 238 },
          { "emoji": "🥺", "count": 235 },
          { "emoji": "😥",  "count": 220 },
          { "emoji": "😔",  "count": 128 },
          { "emoji": "😩",  "count": 125 },
          { "emoji": "😓",  "count": 121 }
        
        ]
      }
    },
    timeAnalysis: {
      mostActiveHour: 21,
      mostActiveDay: "saturday",
      mostActiveDate: "January 15, 2025",
      mostMessagesCount: 42,
      responsePattern: "Quick responses in the evening",
      conversationLength: "Medium to long conversations",
      timeDistribution: [
        {time: "morning", percentage: 25},
        {time: "afternoon", percentage: 15},
        {time: "evening", percentage: 20},
        {time: "night", percentage: 40}
      ],
      hourlyActivity: [
        {hour: 0, count: 12},
        {hour: 1, count: 5},
        {hour: 2, count: 3},
        {hour: 3, count: 1},
        {hour: 4, count: 0},
        {hour: 5, count: 2},
        {hour: 6, count: 7},
        {hour: 7, count: 15},
        {hour: 8, count: 20},
        {hour: 9, count: 25},
        {hour: 10, count: 18},
        {hour: 11, count: 22},
        {hour: 12, count: 30},
        {hour: 13, count: 27},
        {hour: 14, count: 23},
        {hour: 15, count: 18},
        {hour: 16, count: 25},
        {hour: 17, count: 35},
        {hour: 18, count: 45},
        {hour: 19, count: 52},
        {hour: 20, count: 48},
        {hour: 21, count: 56},
        {hour: 22, count: 38},
        {hour: 23, count: 20}
      ],
      dailyActivity: [
        { "date": "Jan 1",  "count": 18 },
        { "date": "Jan 2",  "count": 16 },
        { "date": "Jan 3",  "count": 14 },
        { "date": "Jan 4",  "count": 17 },
       { "date": "Jan 5",  "count": 15 },
        { "date": "Jan 6",  "count": 13 },
    { "date": "Jan 7",  "count": 19 },
    { "date": "Jan 8",  "count": 20 },
    { "date": "Jan 9",  "count": 17 },
    { "date": "Jan 10", "count": 16 },
    { "date": "Jan 11", "count": 15 },
    { "date": "Jan 12", "count": 18 },
    { "date": "Jan 13", "count": 17 },
    { "date": "Jan 14", "count": 16 },
    { "date": "Jan 15", "count": 60 },  // 首个波峰
    { "date": "Jan 16", "count": 19 },
    { "date": "Jan 17", "count": 17 },
    { "date": "Jan 18", "count": 16 },
    { "date": "Jan 19", "count": 18 },
    { "date": "Jan 20", "count": 20 },
    { "date": "Jan 21", "count": 19 },
    { "date": "Jan 22", "count": 18 },
    { "date": "Jan 23", "count": 55 },  // 第二个波峰
    { "date": "Jan 24", "count": 17 },
    { "date": "Jan 25", "count": 16 },
    { "date": "Jan 26", "count": 14 },
    { "date": "Jan 27", "count": 13 },
    { "date": "Jan 28", "count": 15 },
    { "date": "Jan 29", "count": 17 },
    { "date": "Jan 30", "count": 14 },
    { "date": "Jan 31", "count": 16 }
      ],
      weekdayHourHeatmap:[
        {
          "day": "Monday",
          "hours": [
            {"hour": 0, "count": 4}, {"hour": 1, "count": 2}, {"hour": 2, "count": 1}, {"hour": 3, "count": 0},
            {"hour": 4, "count": 1}, {"hour": 5, "count": 3}, {"hour": 6, "count": 5}, {"hour": 7, "count": 8},
            {"hour": 8, "count": 12}, {"hour": 9, "count": 15}, {"hour": 10, "count": 11}, {"hour": 11, "count": 13},
            {"hour": 12, "count": 9}, {"hour": 13, "count": 7}, {"hour": 14, "count": 6}, {"hour": 15, "count": 5},
            {"hour": 16, "count": 8}, {"hour": 17, "count": 10}, {"hour": 18, "count": 14}, {"hour": 19, "count": 18},
            {"hour": 20, "count": 20}, {"hour": 21, "count": 22}, {"hour": 22, "count": 18}, {"hour": 23, "count": 10}
          ]
        },
        {
          "day": "Tuesday",
          "hours": [
            {"hour": 0, "count": 3}, {"hour": 1, "count": 1}, {"hour": 2, "count": 0}, {"hour": 3, "count": 1},
            {"hour": 4, "count": 0}, {"hour": 5, "count": 2}, {"hour": 6, "count": 4}, {"hour": 7, "count": 9},
            {"hour": 8, "count": 14}, {"hour": 9, "count": 17}, {"hour": 10, "count": 15}, {"hour": 11, "count": 18},
            {"hour": 12, "count": 20}, {"hour": 13, "count": 19}, {"hour": 14, "count": 17}, {"hour": 15, "count": 16},
            {"hour": 16, "count": 18}, {"hour": 17, "count": 22}, {"hour": 18, "count": 28}, {"hour": 19, "count": 32},
            {"hour": 20, "count": 35}, {"hour": 21, "count": 75}, {"hour": 22, "count": 65}, {"hour": 23, "count": 60}
          ]
        },
        {
          "day": "Wednesday",
          "hours": [
            {"hour": 0, "count": 5}, {"hour": 1, "count": 2}, {"hour": 2, "count": 1}, {"hour": 3, "count": 0},
            {"hour": 4, "count": 1}, {"hour": 5, "count": 0}, {"hour": 6, "count": 3}, {"hour": 7, "count": 7},
            {"hour": 8, "count": 13}, {"hour": 9, "count": 20}, {"hour": 10, "count": 16}, {"hour": 11, "count": 18},
            {"hour": 12, "count": 22}, {"hour": 13, "count": 21}, {"hour": 14, "count": 19}, {"hour": 15, "count": 14},
            {"hour": 16, "count": 17}, {"hour": 17, "count": 24}, {"hour": 18, "count": 30}, {"hour": 19, "count": 35},
            {"hour": 20, "count": 33}, {"hour": 21, "count": 28}, {"hour": 22, "count": 20}, {"hour": 23, "count": 12}
          ]
        },
        {
          "day": "Thursday",
          "hours": [
            {"hour": 0, "count": 6}, {"hour": 1, "count": 3}, {"hour": 2, "count": 1}, {"hour": 3, "count": 0},
            {"hour": 4, "count": 1}, {"hour": 5, "count": 2}, {"hour": 6, "count": 4}, {"hour": 7, "count": 8},
            {"hour": 8, "count": 16}, {"hour": 9, "count": 22}, {"hour": 10, "count": 18}, {"hour": 11, "count": 20},
            {"hour": 12, "count": 24}, {"hour": 13, "count": 23}, {"hour": 14, "count": 21}, {"hour": 15, "count": 19},
            {"hour": 16, "count": 22}, {"hour": 17, "count": 27}, {"hour": 18, "count": 34}, {"hour": 19, "count": 40},
            {"hour": 20, "count": 38}, {"hour": 21, "count": 26}, {"hour": 22, "count": 18}, {"hour": 23, "count": 15}
          ]
        },
        {
          "day": "Friday",
          "hours": [
            {"hour": 0, "count": 8}, {"hour": 1, "count": 4}, {"hour": 2, "count": 2}, {"hour": 3, "count": 1},
            {"hour": 4, "count": 0}, {"hour": 5, "count": 1}, {"hour": 6, "count": 5}, {"hour": 7, "count": 9},
            {"hour": 8, "count": 14}, {"hour": 9, "count": 18}, {"hour": 10, "count": 17}, {"hour": 11, "count": 20},
            {"hour": 12, "count": 24}, {"hour": 13, "count": 22}, {"hour": 14, "count": 19}, {"hour": 15, "count": 18},
            {"hour": 16, "count": 21}, {"hour": 17, "count": 29}, {"hour": 18, "count": 38}, {"hour": 19, "count": 45},
            {"hour": 20, "count": 42}, {"hour": 21, "count": 80}, {"hour": 22, "count": 70}, {"hour": 23, "count": 65}
          ]
        },
        {
          "day": "Saturday",
          "hours": [
            {"hour": 0, "count": 12}, {"hour": 1, "count": 7}, {"hour": 2, "count": 4}, {"hour": 3, "count": 2},
            {"hour": 4, "count": 1}, {"hour": 5, "count": 0}, {"hour": 6, "count": 2}, {"hour": 7, "count": 5},
            {"hour": 8, "count": 10}, {"hour": 9, "count": 18}, {"hour": 10, "count": 25}, {"hour": 11, "count": 30},
            {"hour": 12, "count": 35}, {"hour": 13, "count": 32}, {"hour": 14, "count": 28}, {"hour": 15, "count": 24},
            {"hour": 16, "count": 29}, {"hour": 17, "count": 36}, {"hour": 18, "count": 44}, {"hour": 19, "count": 50},
            {"hour": 20, "count": 48}, {"hour": 21, "count": 95}, {"hour": 22, "count": 85}, {"hour": 23, "count": 80}
          ]
        },
        {
          "day": "Sunday",
          "hours": [
            {"hour": 0, "count": 10}, {"hour": 1, "count": 6}, {"hour": 2, "count": 3}, {"hour": 3, "count": 1},
            {"hour": 4, "count": 0}, {"hour": 5, "count": 0}, {"hour": 6, "count": 3}, {"hour": 7, "count": 6},
            {"hour": 8, "count": 12}, {"hour": 9, "count": 18}, {"hour": 10, "count": 20}, {"hour": 11, "count": 23},
            {"hour": 12, "count": 27}, {"hour": 13, "count": 25}, {"hour": 14, "count": 22}, {"hour": 15, "count": 19},
            {"hour": 16, "count": 24}, {"hour": 17, "count": 33}, {"hour": 18, "count": 42}, {"hour": 19, "count": 47},
            {"hour": 20, "count": 45}, {"hour": 21, "count": 30}, {"hour": 22, "count": 20}, {"hour": 23, "count": 15}
          ]
        }
      ]
    }
  };
};

/**
 * 获取分析数据
 * @param id 分析数据ID
 * @returns 分析数据
 */
export const getAnalysisData = async (id: string): Promise<AnalysisData | null> => {
  // 在实际应用中，这里会从API或数据库获取数据
  // 这里为了演示，直接返回示例数据
  return generateSampleAnalysisData(id);
};

/**
 * 示例AI分析数据
 */
export const sampleAiInsights = {
  personalityInsights: {
    "sender1": {
      "name": "Emily",
      "interestLevel": {
        "score": 3,
        "detail": "Emily shows relatively low engagement: she seldom initiates new topics, often responds with brief acknowledgments, and rarely asks follow‑up questions."
      },
      "responseEnthusiasm": {
        "score": 2,
        "detail": "Emily’s tone is generally subdued: she rarely uses exclamation marks or emojis and keeps her language neutral."
      },
      "emotionalStability": {
        "score": 1,
        "detail": "Emily’s tone fluctuates considerably; she can swing between excitement and frustration within a single conversation, showing noticeable emotional volatility."
      },
      "responseTime": {
        "score": 4,
        "detail": "Emily often takes several hours to reply and occasionally leaves messages unanswered for a full day."
      }
    },
    "sender2": {
      "name": "John",
      "interestLevel": {
        "score": 9,
        "detail": "John demonstrates very high engagement: he frequently initiates new topics, follows up on details, and sustains the conversation proactively."
      },
      "responseEnthusiasm": {
        "score": 10,
        "detail": "John’s messages are highly enthusiastic: he regularly uses exclamation marks and emojis to convey excitement, especially when discussing his favorite topics."
      },
      "emotionalStability": {
        "score": 8,
        "detail": "John maintains a calm and consistent tone; even during disagreements he remains logical and composed."
      },
      "responseTime": {
        "score": 9,
        "detail": "John is very prompt, typically replying within 15 minutes when active and rarely leaving conversations pending."
      }
    }
  },
  relationshipMetrics: {
    "intimacy": {
      "score": 3,
      "detail": "Intimacy is relatively low: exchanges tend to stay on the surface, with few personal disclosures and minimal discussion of deeper feelings."
    },
    "communication": {
      "score": 5,
      "detail": "Communication is average: messages are generally clear and understandable, though there are occasional lapses or missed nuances."
    },
    "trust": {
      "score": 2,
      "detail": "Trust appears limited: both parties hesitate to share sensitive information and often keep conversations guarded."
    },
    "conflict": {
      "score": 8,
      "detail": "Conflict is infrequent and mild: disagreements are rare and when they do occur, they’re resolved quickly and respectfully."
    }
  },
  relationshipInsights: {
    points: [
      {
        "title": "Surface‑Level Interactions",
        "description": "Conversations tend to remain on everyday topics with few personal disclosures, reflecting the low intimacy score."
      },
      {
        "title": "Generally Clear but Occasional Ambiguity",
        "description": "Most messages are understandable and balanced, but there are moments of missed nuance or unspoken assumptions, matching an average communication rating."
      },
      {
        "title": "Hesitant Trust‑Building",
        "description": "Both parties hold back on sharing sensitive details, indicating limited trust despite polite openness."
      },
      {
        "title": "Calm Conflict Resolution",
        "description": "Disagreements are rare and mild; when they occur, they’re addressed respectfully and resolved quickly, consistent with a low‑conflict dynamic."
      }
    ]
  },
  suggestedTopics: [
    "Sharing a personal challenge you’re comfortable discussing to build trust",
    "Reflecting on a memorable moment from your childhood and what it taught you",
    "Talking through a goal you’re hesitant to pursue and why",
    "Exploring your fears or anxieties and how the other can support you",
    "Discussing a meaningful value you both share and how it shapes your choices"
  ],
  overallAnalysis: {
    messageTips: [
      "Schedule a dedicated check‑in where you both share something more personal than usual",
      "Use open‑ended questions to invite deeper responses rather than surface updates",
      "Express appreciation for each other’s honesty when someone shares vulnerably",
      "Follow up on subtle hints—if something seems unsaid, gently ask for more context",
      "Balance practical planning with intentional moments of emotional connection"
    ]
}
}
