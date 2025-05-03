import { AIInsights, AnalysisData } from "@/types/analysis";
import { ProcessResult } from "@/lib/chat-processing/types";

/**
 * 生成AI分析结果
 * @param processedData 处理后的数据
 * @param locale 语言，默认为英文
 * @returns AI分析结果
 */
export async function generateAIInsights(processedData: ProcessResult | AnalysisData, locale: string = 'en'): Promise<AIInsights> {
  try {
    // 这里应该调用AI服务生成分析结果
    // 但是为了简化，我们直接生成一个示例结果

    // 获取发送者名称
    let sender1Name = 'Person 1';
    let sender2Name = 'Person 2';

    // 检查是否是AnalysisData类型（有overview字段）
    if ('overview' in processedData && processedData.overview) {
      sender1Name = processedData.overview.sender1?.name || 'Person 1';
      sender2Name = processedData.overview.sender2?.name || 'Person 2';
    } else if ('messages' in processedData && Array.isArray(processedData.messages)) {
      // 如果是ProcessResult类型，尝试从消息中提取发送者名称
      const senders = [...new Set(processedData.messages.map((msg: { sender: string }) => msg.sender))];
      if (senders.length > 0) sender1Name = senders[0];
      if (senders.length > 1) sender2Name = senders[1];
    }

    // 生成示例分析结果
    const aiInsights: AIInsights = {
      // 添加符合AIInsights类型定义的必要字段
      personalityInsights: {
        sender1: {
          name: sender1Name,
          interestLevel: { score: 8, detail: "Shows high interest in conversations" },
          responseEnthusiasm: { score: 7, detail: "Responds with enthusiasm most of the time" },
          emotionalStability: { score: 9, detail: "Maintains consistent emotional tone" },
          responseTime: { score: 8, detail: "Responds quickly to messages" }
        },
        sender2: {
          name: sender2Name,
          interestLevel: { score: 7, detail: "Shows good interest in conversations" },
          responseEnthusiasm: { score: 8, detail: "Very enthusiastic in responses" },
          emotionalStability: { score: 8, detail: "Generally stable emotional tone" },
          responseTime: { score: 9, detail: "Responds very quickly to messages" }
        }
      },
      relationshipMetrics: {
        intimacy: { score: 8, detail: "Strong connection between both parties" },
        communication: { score: 9, detail: "Excellent communication patterns" },
        trust: { score: 8, detail: "High level of trust evident in conversations" },
        conflict: { score: 3, detail: "Low level of conflict in conversations" }
      },
      // 保留原有的relationshipInsights字段
      relationshipInsights: {
        points: [
          {
            title: "Communication Style",
            description: `${sender1Name} tends to initiate conversations more often, while ${sender2Name} responds promptly.`
          },
          {
            title: "Conversation Topics",
            description: "Conversations often revolve around daily activities, shared interests, and future plans."
          },
          {
            title: "Emotional Tone",
            description: "The overall emotional tone is positive, with frequent expressions of affection and humor."
          }
        ]
      },
      // 添加suggestedTopics字段
      suggestedTopics: [
        "Daily activities",
        "Shared interests",
        "Future plans",
        "Personal feelings"
      ],
      // 添加overallAnalysis字段
      overallAnalysis: {
        messageTips: [
          "Continue the positive communication pattern",
          "Share more about personal interests",
          "Maintain the quick response times"
        ]
      }
    };

    return aiInsights;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw error;
  }
}
