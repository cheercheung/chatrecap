/**
 * AI分析核心逻辑
 * 负责处理AI分析的核心功能
 */
import { AIInsights } from '@/types/analysis';
import fs from 'fs';
import path from 'path';
import { RawMessage } from '@/lib/chat-processing/types';

/**
 * 创建AI分析提示词
 * @param messages 处理好的消息数组
 * @param locale 语言
 * @returns 提示词
 */
export function createAiAnalysisPrompt(messages: any[], locale: string = 'en'): string {
  // 提取发送者信息
  const senders = [...new Set(messages.map(msg => msg.sender))];
  const sender1 = senders[0] || 'Unknown';
  const sender2 = senders[1] || 'Unknown';

  // 格式化消息样本（最多100条，避免提示词过长）
  const messageSamples = messages.slice(0, 100).map(msg => {
    return `${msg.sender}: ${msg.message}`;
  }).join('\n');

  // 获取提示词模板
  let promptTemplate;
  try {
    // 尝试加载指定语言的提示词
    const promptsPath = path.join(process.cwd(), 'i18n', 'prompts', `${locale}.json`);
    if (fs.existsSync(promptsPath)) {
      const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
      promptTemplate = promptsData.ai_analysis;
    } else {
      throw new Error(`Prompts file for locale ${locale} not found`);
    }
  } catch (error) {
    // 如果加载失败，使用英文提示词
    console.warn(`Failed to load prompts for locale ${locale}, falling back to English:`, error);
    const promptsPath = path.join(process.cwd(), 'i18n', 'prompts', 'en.json');
    try {
      const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
      promptTemplate = promptsData.ai_analysis;
    } catch (fallbackError) {
      console.error('Failed to load English prompts:', fallbackError);
      // 提供一个基本的提示词模板作为后备
      promptTemplate = {
        intro: "You are a professional chat analysis expert. Please analyze the following conversation between two people and generate a detailed relationship analysis report.",
        chat_info: "Person 1: {sender1}\nPerson 2: {sender2}\n\nChat sample (partial):\n{messageSamples}",
        instructions: "Based on these chat messages, analyze the communication patterns, relationship dynamics, and personality traits of both individuals. Your analysis should include:\n\n1. Personality insights for each person, including interest level, response enthusiasm, emotional stability, and response time\n2. Relationship metrics, including intimacy, communication quality, trust, and conflict level\n3. Relationship insights, including interaction patterns and relationship characteristics\n4. Suggested topics and overall analysis",
        output_format: "Please return your analysis in the following JSON format:",
        json_template: `{
          "personalityInsights": {
            "sender1": {
              "name": "{sender1}",
              "interestLevel": { "score": 0-10, "detail": "Analysis of interest level" },
              "responseEnthusiasm": { "score": 0-10, "detail": "Analysis of response enthusiasm" },
              "emotionalStability": { "score": 0-10, "detail": "Analysis of emotional stability" },
              "responseTime": { "score": 0-10, "detail": "Analysis of response time" }
            },
            "sender2": {
              "name": "{sender2}",
              "interestLevel": { "score": 0-10, "detail": "Analysis of interest level" },
              "responseEnthusiasm": { "score": 0-10, "detail": "Analysis of response enthusiasm" },
              "emotionalStability": { "score": 0-10, "detail": "Analysis of emotional stability" },
              "responseTime": { "score": 0-10, "detail": "Analysis of response time" }
            }
          },
          "relationshipMetrics": {
            "intimacy": { "score": 0-10, "detail": "Analysis of intimacy level" },
            "communication": { "score": 0-10, "detail": "Analysis of communication quality" },
            "trust": { "score": 0-10, "detail": "Analysis of trust level" },
            "conflict": { "score": 0-10, "detail": "Analysis of conflict level" }
          },
          "relationshipInsights": {
            "points": [
              { "title": "Insight title 1", "description": "Detailed description" },
              { "title": "Insight title 2", "description": "Detailed description" }
            ]
          },
          "suggestedTopics": ["Topic 1", "Topic 2", "Topic 3"],
          "overallAnalysis": {
            "messageTips": ["Tip 1", "Tip 2", "Tip 3"]
          }
        }`,
        final_instructions: "Ensure your analysis is based on the actual content of the chat messages, not assumptions. If information is insufficient for certain aspects, note this in your analysis. Please return only the JSON result without any other text."
      };
    }
  }

  // 替换模板中的变量
  const chatInfo = promptTemplate.chat_info
    .replace('{sender1}', sender1)
    .replace('{sender2}', sender2)
    .replace('{messageSamples}', messageSamples);

  // 替换模板中的变量
  const jsonTemplate = promptTemplate.json_template
    .replace(/\{sender1\}/g, sender1)
    .replace(/\{sender2\}/g, sender2);

  // 构建完整的提示词
  const prompt = `${promptTemplate.intro}

${chatInfo}

${promptTemplate.instructions}

${promptTemplate.output_format}

${jsonTemplate}

${promptTemplate.final_instructions}`;

  return prompt;
}

/**
 * 验证AI分析结果结构
 * @param aiInsights AI分析结果
 * @throws 如果结构不符合要求
 */
export function validateAiInsights(aiInsights: any): asserts aiInsights is AIInsights {
  // 基本结构验证
  if (!aiInsights.personalityInsights || !aiInsights.relationshipMetrics) {
    throw new Error('AI分析结果缺少必要的字段');
  }

  // 验证personalityInsights
  const { personalityInsights } = aiInsights;
  if (!personalityInsights.sender1 || !personalityInsights.sender2) {
    throw new Error('personalityInsights缺少sender1或sender2');
  }

  // 验证relationshipMetrics
  const { relationshipMetrics } = aiInsights;
  if (!relationshipMetrics.intimacy || !relationshipMetrics.communication ||
      !relationshipMetrics.trust || !relationshipMetrics.conflict) {
    throw new Error('relationshipMetrics缺少必要的指标');
  }

  // 验证relationshipInsights
  if (!aiInsights.relationshipInsights || !Array.isArray(aiInsights.relationshipInsights.points)) {
    throw new Error('relationshipInsights结构不正确');
  }

  // 验证suggestedTopics
  if (!aiInsights.suggestedTopics || !Array.isArray(aiInsights.suggestedTopics)) {
    throw new Error('suggestedTopics结构不正确');
  }

  // 验证overallAnalysis
  if (!aiInsights.overallAnalysis || !Array.isArray(aiInsights.overallAnalysis.messageTips)) {
    throw new Error('overallAnalysis结构不正确');
  }
}

/**
 * 从AI响应中提取JSON结果
 * @param aiResponse AI响应文本
 * @returns 解析后的JSON对象
 */
export function extractJsonFromAiResponse(aiResponse: string): any {
  try {
    // 尝试从响应中提取JSON部分
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found in response");
    }
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw error;
  }
}
