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
      totalMessages: 473,
      totalWords: 5243,
      wordsPerMessage: 11.1,
      sender1: {
        name: "Jessica",
        messages: 235,
        words: 2743,
        wordsPerMessage: 11.7
      },
      sender2: {
        name: "Michael",
        messages: 238,
        words: 2500,
        wordsPerMessage: 10.5
      },
      avgMessagesPerDay: 15.3,
      mostActiveDay: "day_names.saturday",
      responseTime: "3 minutes"
    },
    textAnalysis: {
      commonWords: [
        {word: "love", count: 37},
        {word: "miss", count: 28},
        {word: "good", count: 25},
        {word: "time", count: 22},
        {word: "day", count: 18},
        {word: "home", count: 16},
        {word: "happy", count: 14},
        {word: "night", count: 13},
        {word: "today", count: 12},
        {word: "soon", count: 11},
        {word: "thanks", count: 10},
        {word: "sweet", count: 9},
        {word: "beautiful", count: 8},
        {word: "morning", count: 8},
        {word: "sleep", count: 7}
      ],
      sentimentScore: 0.78,
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
      wordCount: 5243,
      sender1: {
        name: "Jessica",
        commonWords: [
          {word: "love", count: 23},
          {word: "miss", count: 18},
          {word: "good", count: 15},
          {word: "happy", count: 12},
          {word: "time", count: 10},
          {word: "day", count: 9},
          {word: "night", count: 9},
          {word: "home", count: 8},
          {word: "sweet", count: 7},
          {word: "beautiful", count: 7}
        ],
        topEmojis: [
          {emoji: "❤️", count: 28},
          {emoji: "😊", count: 22},
          {emoji: "😘", count: 20},
          {emoji: "😍", count: 15},
          {emoji: "🥰", count: 13},
          {emoji: "💕", count: 10},
          {emoji: "🙏", count: 8},
          {emoji: "😁", count: 7},
          {emoji: "🌸", count: 6},
          {emoji: "💋", count: 5}
        ]
      },
      sender2: {
        name: "Michael",
        commonWords: [
          {word: "love", count: 14},
          {word: "time", count: 12},
          {word: "good", count: 10},
          {word: "miss", count: 10},
          {word: "day", count: 9},
          {word: "today", count: 9},
          {word: "home", count: 8},
          {word: "soon", count: 8},
          {word: "thanks", count: 7},
          {word: "night", count: 4}
        ],
        topEmojis: [
          {emoji: "❤️", count: 14},
          {emoji: "😊", count: 14},
          {emoji: "👍", count: 12},
          {emoji: "😘", count: 9},
          {emoji: "😂", count: 9},
          {emoji: "😍", count: 7},
          {emoji: "🥰", count: 5},
          {emoji: "🙌", count: 4},
          {emoji: "👌", count: 4},
          {emoji: "🤔", count: 3}
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
        {date: "Jan 1", count: 12},
        {date: "Jan 2", count: 15},
        {date: "Jan 3", count: 18},
        {date: "Jan 4", count: 22},
        {date: "Jan 5", count: 25},
        {date: "Jan 6", count: 20},
        {date: "Jan 7", count: 18},
        {date: "Jan 8", count: 22},
        {date: "Jan 9", count: 25},
        {date: "Jan 10", count: 28},
        {date: "Jan 11", count: 30},
        {date: "Jan 12", count: 35},
        {date: "Jan 13", count: 38},
        {date: "Jan 14", count: 40},
        {date: "Jan 15", count: 42},
        {date: "Jan 16", count: 38},
        {date: "Jan 17", count: 35},
        {date: "Jan 18", count: 32},
        {date: "Jan 19", count: 30},
        {date: "Jan 20", count: 28},
        {date: "Jan 21", count: 25},
        {date: "Jan 22", count: 22},
        {date: "Jan 23", count: 20},
        {date: "Jan 24", count: 18},
        {date: "Jan 25", count: 15},
        {date: "Jan 26", count: 17},
        {date: "Jan 27", count: 20},
        {date: "Jan 28", count: 22},
        {date: "Jan 29", count: 25},
        {date: "Jan 30", count: 28},
        {date: "Jan 31", count: 30}
      ],
      weekdayHourHeatmap: [
        {
          day: "Monday",
          hours: [
            {hour: 0, count: 5}, {hour: 1, count: 2}, {hour: 2, count: 1}, {hour: 3, count: 0},
            {hour: 4, count: 0}, {hour: 5, count: 1}, {hour: 6, count: 3}, {hour: 7, count: 8},
            {hour: 8, count: 15}, {hour: 9, count: 18}, {hour: 10, count: 12}, {hour: 11, count: 15},
            {hour: 12, count: 20}, {hour: 13, count: 18}, {hour: 14, count: 15}, {hour: 15, count: 12},
            {hour: 16, count: 15}, {hour: 17, count: 20}, {hour: 18, count: 25}, {hour: 19, count: 30},
            {hour: 20, count: 28}, {hour: 21, count: 35}, {hour: 22, count: 25}, {hour: 23, count: 10}
          ]
        },
        {
          day: "Tuesday",
          hours: [
            {hour: 0, count: 4}, {hour: 1, count: 1}, {hour: 2, count: 0}, {hour: 3, count: 0},
            {hour: 4, count: 0}, {hour: 5, count: 1}, {hour: 6, count: 2}, {hour: 7, count: 7},
            {hour: 8, count: 12}, {hour: 9, count: 16}, {hour: 10, count: 14}, {hour: 11, count: 18},
            {hour: 12, count: 22}, {hour: 13, count: 20}, {hour: 14, count: 18}, {hour: 15, count: 16},
            {hour: 16, count: 18}, {hour: 17, count: 24}, {hour: 18, count: 30}, {hour: 19, count: 35},
            {hour: 20, count: 32}, {hour: 21, count: 38}, {hour: 22, count: 28}, {hour: 23, count: 12}
          ]
        },
        {
          day: "Wednesday",
          hours: [
            {hour: 0, count: 6}, {hour: 1, count: 2}, {hour: 2, count: 1}, {hour: 3, count: 0},
            {hour: 4, count: 0}, {hour: 5, count: 0}, {hour: 6, count: 3}, {hour: 7, count: 6},
            {hour: 8, count: 14}, {hour: 9, count: 20}, {hour: 10, count: 16}, {hour: 11, count: 20},
            {hour: 12, count: 25}, {hour: 13, count: 22}, {hour: 14, count: 20}, {hour: 15, count: 15},
            {hour: 16, count: 20}, {hour: 17, count: 28}, {hour: 18, count: 35}, {hour: 19, count: 40},
            {hour: 20, count: 38}, {hour: 21, count: 42}, {hour: 22, count: 30}, {hour: 23, count: 15}
          ]
        },
        {
          day: "Thursday",
          hours: [
            {hour: 0, count: 8}, {hour: 1, count: 3}, {hour: 2, count: 1}, {hour: 3, count: 0},
            {hour: 4, count: 0}, {hour: 5, count: 1}, {hour: 6, count: 2}, {hour: 7, count: 7},
            {hour: 8, count: 16}, {hour: 9, count: 22}, {hour: 10, count: 18}, {hour: 11, count: 22},
            {hour: 12, count: 28}, {hour: 13, count: 25}, {hour: 14, count: 21}, {hour: 15, count: 18},
            {hour: 16, count: 22}, {hour: 17, count: 30}, {hour: 18, count: 38}, {hour: 19, count: 45},
            {hour: 20, count: 42}, {hour: 21, count: 46}, {hour: 22, count: 32}, {hour: 23, count: 18}
          ]
        },
        {
          day: "Friday",
          hours: [
            {hour: 0, count: 12}, {hour: 1, count: 6}, {hour: 2, count: 3}, {hour: 3, count: 1},
            {hour: 4, count: 0}, {hour: 5, count: 0}, {hour: 6, count: 2}, {hour: 7, count: 5},
            {hour: 8, count: 12}, {hour: 9, count: 18}, {hour: 10, count: 15}, {hour: 11, count: 20},
            {hour: 12, count: 26}, {hour: 13, count: 24}, {hour: 14, count: 20}, {hour: 15, count: 18},
            {hour: 16, count: 22}, {hour: 17, count: 32}, {hour: 18, count: 42}, {hour: 19, count: 48},
            {hour: 20, count: 45}, {hour: 21, count: 50}, {hour: 22, count: 40}, {hour: 23, count: 25}
          ]
        },
        {
          day: "Saturday",
          hours: [
            {hour: 0, count: 18}, {hour: 1, count: 10}, {hour: 2, count: 6}, {hour: 3, count: 2},
            {hour: 4, count: 1}, {hour: 5, count: 0}, {hour: 6, count: 1}, {hour: 7, count: 4},
            {hour: 8, count: 8}, {hour: 9, count: 15}, {hour: 10, count: 22}, {hour: 11, count: 28},
            {hour: 12, count: 35}, {hour: 13, count: 32}, {hour: 14, count: 30}, {hour: 15, count: 25},
            {hour: 16, count: 30}, {hour: 17, count: 38}, {hour: 18, count: 48}, {hour: 19, count: 52},
            {hour: 20, count: 50}, {hour: 21, count: 55}, {hour: 22, count: 42}, {hour: 23, count: 30}
          ]
        },
        {
          day: "Sunday",
          hours: [
            {hour: 0, count: 15}, {hour: 1, count: 8}, {hour: 2, count: 4}, {hour: 3, count: 1},
            {hour: 4, count: 0}, {hour: 5, count: 0}, {hour: 6, count: 2}, {hour: 7, count: 5},
            {hour: 8, count: 10}, {hour: 9, count: 18}, {hour: 10, count: 20}, {hour: 11, count: 25},
            {hour: 12, count: 30}, {hour: 13, count: 28}, {hour: 14, count: 25}, {hour: 15, count: 20},
            {hour: 16, count: 25}, {hour: 17, count: 35}, {hour: 18, count: 45}, {hour: 19, count: 50},
            {hour: 20, count: 48}, {hour: 21, count: 52}, {hour: 22, count: 38}, {hour: 23, count: 22}
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
    sender1: {
      name: "Alice",
      interestLevel: {
        score: 8,
        detail:
          "Alice shows high interest in the conversation, frequently initiating new topics and asking follow-up questions. She responds to almost all messages and shows curiosity about Bob's opinions and experiences."
      },
      responseEnthusiasm: {
        score: 7,
        detail:
          "Alice's messages are often enthusiastic, using exclamation marks and positive language. She frequently uses emojis to express excitement and engagement with the conversation."
      },
      emotionalStability: {
        score: 9,
        detail:
          "Alice maintains a consistent positive tone throughout conversations. Even during disagreements, she remains calm and constructive, rarely showing signs of emotional volatility."
      },
      responseTime: {
        score: 6,
        detail:
          "Alice typically responds within 30 minutes during active conversation periods, though sometimes takes longer during work hours. She rarely leaves messages unanswered for more than a day."
      }
    },
    sender2: {
      name: "Bob",
      interestLevel: {
        score: 7,
        detail:
          "Bob demonstrates good interest in conversations, though he tends to respond more than initiate. He engages well with topics Alice introduces and occasionally brings up new subjects of his own."
      },
      responseEnthusiasm: {
        score: 5,
        detail:
          "Bob's communication style is more reserved, with fewer exclamation marks and emojis than Alice. His enthusiasm is more evident when discussing specific topics like movies and technology."
      },
      emotionalStability: {
        score: 8,
        detail:
          "Bob maintains a steady emotional tone in most conversations. He rarely shows frustration and tends to approach disagreements with a logical perspective rather than emotional reactions."
      },
      responseTime: {
        score: 8,
        detail:
          "Bob is very prompt with responses, typically replying within 15 minutes when active. He's consistent about checking messages and rarely leaves conversations hanging."
      }
    }
  },
  relationshipMetrics: {
    intimacy: {
      score: 7,
      detail:
        "The conversation shows a good level of intimacy with regular sharing of personal experiences and feelings. Both parties feel comfortable discussing their daily lives and occasional deeper topics, though some emotional reserve is still present."
    },
    communication: {
      score: 8,
      detail:
        "Communication flows naturally with minimal misunderstandings. Both parties express themselves clearly and ask clarifying questions when needed. Conversations have a good balance of listening and sharing from both sides."
    },
    trust: {
      score: 9,
      detail:
        "There's a strong foundation of trust evident in their willingness to share personal information and vulnerabilities. Neither party shows signs of withholding information or being guarded in their communication."
    },
    conflict: {
      score: 3,
      detail:
        "Very little conflict appears in the conversations. When disagreements arise, they're handled respectfully with both parties willing to consider the other's perspective. No instances of heated arguments or lasting tension were observed."
    }
  },
  relationshipInsights: {
    points: [
      {
        title: "Complementary Communication Styles",
        description:
          "Alice's enthusiasm balances well with Bob's more measured approach, creating a dynamic where both parties feel heard and valued."
      },
      {
        title: "Shared Intellectual Curiosity",
        description:
          "Both demonstrate interest in learning and discussing new ideas, which strengthens their connection through meaningful exchanges."
      },
      {
        title: "Mutual Respect",
        description:
          "Their conversations show consistent patterns of acknowledging each other's opinions and perspectives, even when they differ."
      },
      {
        title: "Growth Opportunity",
        description:
          "They could benefit from more vulnerable discussions about future hopes and fears, which are currently touched on but not explored deeply."
      }
    ]
  },
  suggestedTopics: [
    "Future aspirations and how you might support each other's goals",
    "Deeper exploration of childhood experiences that shaped your values",
    "Philosophical discussions about life purpose and meaning",
    "Travel dreams and potential shared adventures",
    "Creative projects you might enjoy working on together"
  ],
  overallAnalysis: {
    messageTips: [
      "Consider setting aside dedicated time for deeper conversations without distractions",
      "Try sharing more vulnerable thoughts when discussing challenging topics",
      "Acknowledge each other's messages even when busy, with a quick response indicating you'll reply more fully later",
      "Continue the positive pattern of asking follow-up questions to show engagement",
      "Balance practical discussions with more playful, imaginative exchanges"
    ]
  }
};
