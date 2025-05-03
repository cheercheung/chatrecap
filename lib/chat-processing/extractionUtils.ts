import { RawEntry } from './types';
import { messagePatterns } from './platforms/whatsapp/patterns';

/**
 * 合并 WhatsApp 多行消息
 * @param lines 行数组
 * @returns 合并后的行数组
 */
export function mergeWhatsAppMultilineMessages(lines: string[]): string[] {
  const result: string[] = [];
  let currentMessage: string | null = null;

  // 优化：使用更全面的快速检查模式
  const quickCheckPatterns = [
    // 标准 WhatsApp 格式
    /^\[\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{1,2}(:\d{1,2})?\]/,
    // 带 p.m./a.m. 的西班牙语格式
    /^\[\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{1,2}(:\d{1,2})?\s*(?:a\.m\.|p\.m\.|A\.M\.|P\.M\.)\]/,
    // 英文月份名格式 - 大写月份
    /^\[(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+(?:st|nd|rd|th)?\s+\d{4}\s+\d{1,2}:\d{1,2}(?:am|pm|AM|PM)?(?::\d{1,2})?\]/,
    // 英文月份名格式 - 小写月份
    /^\[(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d+(?:st|nd|rd|th)?\s+\d{4}\s+\d{1,2}:\d{1,2}(?:am|pm|AM|PM)?(?::\d{1,2})?\]/,
    // 任何方括号开头，后跟发送者和冒号
    /^\[[^\]]+\]\s+[^:]+:/,
    // 任何方括号开头，后跟发送者和破折号
    /^\[[^\]]+\]\s+[^-]+-/,
    // 任何圆括号开头，后跟发送者和冒号
    /^\([^)]+\)\s+[^:]+:/,
    // 任何圆括号开头，后跟发送者和破折号
    /^\([^)]+\)\s+[^-]+-/,
    // 日期格式，如 15/02/25 或 2025-02-15，后跟冒号
    /^\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}.*?:/,
    // 日期格式，如 15/02/25 或 2025-02-15，后跟破折号
    /^\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}.*?-/
  ];

  // 检查是否是新消息的开始 - 增强版本
  const isMessageStart = (line: string): boolean => {
    // 首先使用快速检查模式
    for (const pattern of quickCheckPatterns) {
      if (pattern.test(line)) {
        return true;
      }
    }

    // 如果快速检查失败，尝试完整的模式集
    // 优化：使用 some 方法的短路特性
    return messagePatterns.some(pattern => pattern.test(line));
  };

  // 优化：预先分配足够的空间以减少数组重新分配
  result.length = Math.min(lines.length, 10000);

  // 优化：使用 for 循环代替 forEach 以提高性能
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 跳过空行
    if (!line || line.trim() === '') {
      continue;
    }

    if (isMessageStart(line)) {
      // 如果有当前消息，添加到结果中
      if (currentMessage !== null) {
        result.push(currentMessage);
      }
      // 开始新消息
      currentMessage = line;
    } else if (currentMessage !== null) {
      // 继续当前消息，使用换行符连接，保留原始格式
      currentMessage += '\n' + line;
    } else {
      // 如果没有当前消息但行不是消息开始，尝试作为独立消息处理
      // 这有助于处理格式不规范的消息
      if (line.includes(':')) {
        currentMessage = line;
      }
    }
  }

  // 添加最后一条消息
  if (currentMessage !== null) {
    result.push(currentMessage);
  }

  // 过滤掉空结果
  return result.filter(msg => msg && msg.trim() !== '');
}

/**
 * 从行中提取 WhatsApp 消息条目
 * @param lines 行数组
 * @returns 提取的消息条目数组
 */
export function extractWhatsAppEntries(lines: string[]): RawEntry[] {
  console.log(`开始从 ${lines?.length || 0} 行中提取消息条目`);

  // 检查输入
  if (!Array.isArray(lines) || lines.length === 0) {
    console.warn('没有行可处理');
    return [];
  }

  // 创建结果数组
  const entries: RawEntry[] = [];

  // 预处理：检查前几行以确定最可能的消息格式
  const sampleLines = lines.slice(0, Math.min(10, lines.length));
  let mostLikelyPatternIndex = 0;
  let maxMatches = 0;

  // 找出最可能的消息格式
  for (let i = 0; i < messagePatterns.length; i++) {
    const pattern = messagePatterns[i];
    let matches = 0;

    for (const line of sampleLines) {
      if (pattern.test(line)) {
        matches++;
      }
    }

    if (matches > maxMatches) {
      maxMatches = matches;
      mostLikelyPatternIndex = i;
    }
  }

  // 使用最可能的模式作为首选模式
  const primaryPattern = messagePatterns[mostLikelyPatternIndex];
  console.log(`检测到最可能的消息格式: 模式 #${mostLikelyPatternIndex}`);

  // 缓存常用的模式索引
  const lastPatternIndex = messagePatterns.length - 1;
  const secondLastPatternIndex = messagePatterns.length - 2;

  let matchedCount = 0;
  let unmatchedCount = 0;

  // 使用 for 循环处理每一行
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    // 跳过空行或未定义的行
    if (!line || line.trim() === '') {
      continue;
    }

    let matched = false;

    try {
      // 首先尝试最可能的模式
      let match = line.match(primaryPattern);
      if (match) {
        // 处理匹配结果
        handleMatchResult(match, mostLikelyPatternIndex, entries);
        matchedCount++;
        matched = true;
      } else {
        // 如果首选模式不匹配，尝试其他模式
        for (let i = 0; i < messagePatterns.length; i++) {
          if (i === mostLikelyPatternIndex) continue; // 跳过已尝试的模式

          const pattern = messagePatterns[i];
          match = line.match(pattern);

          if (match) {
            // 处理匹配结果
            handleMatchResult(match, i, entries);
            matchedCount++;
            matched = true;
            break; // 找到匹配的模式后跳出内循环
          }
        }
      }

      if (!matched) {
        unmatchedCount++;
        // 如果所有模式都不匹配，但行看起来像是消息（包含冒号），尝试最基本的提取
        if (line.includes(':')) {
          const colonIndex = line.indexOf(':');
          const sender = line.substring(0, colonIndex).trim();
          const message = line.substring(colonIndex + 1).trim();

          if (sender && message) {
            const now = new Date();
            entries.push({
              datePart: now.toLocaleDateString(),
              timePart: now.toLocaleTimeString(),
              sender,
              message
            });
            matchedCount++;
          }
        }
      }
    } catch (error) {
      console.error(`处理行时出错: "${line.substring(0, 50)}..."`, error);
      unmatchedCount++;
    }

    // 每处理1000行记录一次进度
    if (lineIndex % 1000 === 0 && lineIndex > 0) {
      console.log(`处理进度: ${Math.round((lineIndex / lines.length) * 100)}%, 匹配: ${matchedCount}, 未匹配: ${unmatchedCount}`);
    }
  }

  console.log(`提取完成: 总共 ${lines.length} 行, 匹配 ${matchedCount} 行, 未匹配 ${unmatchedCount} 行`);

  return entries;

  // 内部函数：处理匹配结果
  function handleMatchResult(match: RegExpMatchArray, patternIndex: number, entries: RawEntry[]): void {
    // 根据模式的不同，处理不同的匹配组
    if (patternIndex === lastPatternIndex) {
      // 最宽松的格式: 发送者-消息
      const [, sender, message] = match;

      // 使用当前日期作为默认值
      const now = new Date();

      entries.push({
        datePart: now.toLocaleDateString(),
        timePart: now.toLocaleTimeString(),
        sender: sender.trim(),
        message: message.trim()
      });
    } else if (patternIndex === lastPatternIndex - 1) {
      // 最宽松的格式: 发送者: 消息
      const [, sender, message] = match;

      // 使用当前日期作为默认值
      const now = new Date();

      entries.push({
        datePart: now.toLocaleDateString(),
        timePart: now.toLocaleTimeString(),
        sender: sender.trim(),
        message: message.trim()
      });
    } else if (patternIndex === secondLastPatternIndex - 1) {
      // 更宽松的格式: 任何日期/时间格式，后跟发送者和破折号消息
      const [, dateTimePart, sender, message] = match;

      // 使用更高效的字符串分割
      const commaIndex = dateTimePart.indexOf(',');
      let datePart, timePart;

      if (commaIndex !== -1) {
        datePart = dateTimePart.substring(0, commaIndex);
        timePart = dateTimePart.substring(commaIndex + 1);
      } else {
        const parts = dateTimePart.split(/\s+/);
        datePart = parts[0] || '';
        timePart = parts.slice(1).join(' ') || '';
      }

      entries.push({
        datePart: datePart.trim(),
        timePart: timePart.trim(),
        sender: sender.trim(),
        message: message.trim()
      });
    } else if (patternIndex === secondLastPatternIndex) {
      // 更宽松的格式: 任何日期/时间格式，后跟发送者和消息
      const [, dateTimePart, sender, message] = match;

      // 使用更高效的字符串分割
      const commaIndex = dateTimePart.indexOf(',');
      let datePart, timePart;

      if (commaIndex !== -1) {
        datePart = dateTimePart.substring(0, commaIndex);
        timePart = dateTimePart.substring(commaIndex + 1);
      } else {
        const parts = dateTimePart.split(/\s+/);
        datePart = parts[0] || '';
        timePart = parts.slice(1).join(' ') || '';
      }

      entries.push({
        datePart: datePart.trim(),
        timePart: timePart.trim(),
        sender: sender.trim(),
        message: message.trim()
      });
    } else if (patternIndex === 0) {
      // 处理使用破折号而不是冒号的格式: [april 2nd 2025 1:20pm]Mom-❤️I have nothing...
      let datePart, timePart, sender, message;

      // 这种格式只有三个捕获组: 日期, 发送者, 消息
      [, datePart, sender, message] = match;

      // 从日期部分提取时间
      const dateTimeParts = datePart.split(/\s+/);
      if (dateTimeParts.length >= 4) {
        timePart = dateTimeParts[dateTimeParts.length - 1];
        datePart = dateTimeParts.slice(0, dateTimeParts.length - 1).join(' ');
      } else {
        timePart = '';
      }

      entries.push({
        datePart: datePart.trim(),
        timePart: timePart.trim(),
        sender: sender.trim(),
        message: message.trim()
      });
    } else if (patternIndex >= 0 && patternIndex <= 3) {
      // 英文月份名格式: [april 2nd 2025 1:20pm]Mom-❤️: 消息
      // 注意：这些模式的捕获组可能不同
      let datePart, timePart, sender, message;

      console.log(`处理英文月份名格式，模式索引: ${patternIndex}, 匹配组数量: ${match.length}`);
      console.log(`匹配内容: ${match[0]}`);

      if (match.length >= 5) {
        // 有表情符号或特殊字符的格式
        [, datePart, , sender, message] = match;
        // 从日期部分提取时间
        const dateTimeParts = datePart.split(/\s+/);
        if (dateTimeParts.length >= 4) {
          timePart = dateTimeParts[dateTimeParts.length - 1];
          datePart = dateTimeParts.slice(0, dateTimeParts.length - 1).join(' ');
        } else {
          timePart = '';
        }
      } else if (match.length >= 4) {
        // 标准格式
        [, datePart, sender, message] = match;
        // 从日期部分提取时间
        const dateTimeParts = datePart.split(/\s+/);
        if (dateTimeParts.length >= 4) {
          timePart = dateTimeParts[dateTimeParts.length - 1];
          datePart = dateTimeParts.slice(0, dateTimeParts.length - 1).join(' ');
        } else {
          timePart = '';
        }
      } else if (match.length === 3) {
        // 使用破折号而不是冒号的格式: [april 2nd 2025 1:20pm]Mom-消息
        [, datePart, sender, message] = match;
        // 从日期部分提取时间
        const dateTimeParts = datePart.split(/\s+/);
        if (dateTimeParts.length >= 4) {
          timePart = dateTimeParts[dateTimeParts.length - 1];
          datePart = dateTimeParts.slice(0, dateTimeParts.length - 1).join(' ');
        } else {
          timePart = '';
        }
      } else {
        // 如果匹配组不足，使用默认值
        const now = new Date();
        datePart = now.toLocaleDateString();
        timePart = now.toLocaleTimeString();
        sender = match[1] || 'Unknown';
        message = match[2] || '';
      }

      console.log(`解析结果: datePart=${datePart}, timePart=${timePart}, sender=${sender}, message=${message.substring(0, 30)}...`);

      entries.push({
        datePart: datePart.trim(),
        timePart: timePart.trim(),
        sender: sender.trim(),
        message: message.trim()
      });
    } else if (patternIndex === 5 || patternIndex === 7 || patternIndex === 9 || patternIndex === 11 ||
               patternIndex === 13 || patternIndex === 15 || patternIndex === 17 || patternIndex === 19) {
      // 处理带破折号的格式: [日期, 时间] 发送者-消息
      if (match.length >= 5) {
        const [, datePart, timePart, sender, message] = match;

        entries.push({
          datePart: datePart.trim(),
          timePart: timePart.trim(),
          sender: sender.trim(),
          message: message.trim()
        });
      } else if (match.length >= 4) {
        const [, datePart, timePart, message] = match;

        entries.push({
          datePart: datePart.trim(),
          timePart: timePart.trim(),
          sender: 'Unknown',
          message: message.trim()
        });
      }
    } else {
      // 其他格式: [日期, 时间] 发送者: 消息
      // 确保有足够的匹配组
      if (match.length >= 5) {
        const [, datePart, timePart, sender, message] = match;

        entries.push({
          datePart: datePart.trim(),
          timePart: timePart.trim(),
          sender: sender.trim(),
          message: message.trim()
        });
      } else if (match.length >= 4) {
        const [, datePart, timePart, sender, message] = match;

        entries.push({
          datePart: datePart.trim(),
          timePart: timePart.trim(),
          sender: sender.trim(),
          message: message ? message.trim() : ''
        });
      } else if (match.length === 3) {
        // 只有三个匹配组的情况
        const [, sender, message] = match;
        const now = new Date();

        entries.push({
          datePart: now.toLocaleDateString(),
          timePart: now.toLocaleTimeString(),
          sender: sender.trim(),
          message: message.trim()
        });
      }
    }
  }
}
