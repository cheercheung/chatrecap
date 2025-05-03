/**
 * 移除控制字符
 * @param text 输入文本
 * @returns 清理后的文本
 */
export function removeControlCharacters(text: string): string {
  return text.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u2060-\u206F]/g, '');
}

/**
 * 清理文本，移除控制字符和多余空格
 * @param text 输入文本
 * @returns 清理后的文本
 */
export function cleanText(text: string): string {
  return removeControlCharacters(text)
    // 移除 BOM
    .replace(/^\uFEFF/, '')
    // 移除多余空格
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 标准化换行符
 * @param text 输入文本
 * @returns 标准化后的文本
 */
export function normalizeLineBreaks(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

/**
 * 拆分文本为行
 * @param text 输入文本
 * @param removeEmpty 是否移除空行
 * @returns 行数组
 */
export function splitToLines(text: string, removeEmpty: boolean = true): string[] {
  // 尝试使用多种换行符分割文本
  let lines: string[] = [];

  // 首先尝试使用标准换行符 \n
  lines = text.split('\n');

  // 如果只有一行，尝试使用 \r\n
  if (lines.length <= 1) {
    lines = text.split('\r\n');
  }

  // 如果仍然只有一行，尝试使用 WhatsApp 消息格式的开头进行分割
  if (lines.length <= 1) {
    console.log('尝试使用 WhatsApp 消息格式分割文本');

    // 使用正则表达式匹配 WhatsApp 消息的开头，包括西班牙语格式 (a.m./p.m.)
    const regex = /\[\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{1,2}(:\d{1,2})?\s*(?:a\.m\.|p\.m\.|A\.M\.|P\.M\.)?\]/g;
    let match;
    let lastIndex = 0;
    const tempLines: string[] = [];

    // 查找所有匹配的位置
    while ((match = regex.exec(text)) !== null) {
      // 如果不是第一个匹配，添加前一个匹配到当前匹配之间的文本
      if (lastIndex > 0) {
        const line = text.substring(lastIndex, match.index);
        if (line.trim().length > 0) {
          tempLines.push(line);
        }
      }

      // 更新最后一个匹配的位置
      lastIndex = match.index;
    }

    // 添加最后一个匹配之后的文本
    if (lastIndex > 0 && lastIndex < text.length) {
      const line = text.substring(lastIndex);
      if (line.trim().length > 0) {
        tempLines.push(line);
      }
    }

    // 如果找到了匹配，使用它们
    if (tempLines.length > 0) {
      lines = tempLines;
    }
  }

  // 如果仍然只有一行，尝试使用正则表达式直接提取消息
  if (lines.length <= 1) {
    console.log('尝试使用正则表达式直接提取消息');

    // 尝试使用方括号分割
    const text = lines[0];
    const bracketLines = text.split(/\[/);

    // 处理分割后的行
    if (bracketLines.length > 1) {
      const processedLines = [];

      // 第一个元素是空字符串，跳过
      for (let i = 1; i < bracketLines.length; i++) {
        const line = '[' + bracketLines[i];
        if (line.trim().length > 0) {
          processedLines.push(line);
        }
      }

      if (processedLines.length > 0) {
        console.log(`使用方括号分割，找到 ${processedLines.length} 条消息`);
        lines = processedLines;
      }
    } else {
      // 如果方括号分割失败，尝试使用数字日期格式
      const regex = /\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2}(:\d{1,2})?\s*(?:a\.m\.|p\.m\.|A\.M\.|P\.M\.)?)\]\s+([^:-]+)(?:-|:\s+)(.+?)(?=\[\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{1,2}|$)/g;
      let match;
      const messages: string[] = [];

      while ((match = regex.exec(text)) !== null) {
        // 构建完整消息格式，确保格式一致
        const datePart = match[1];
        const timePart = match[2];
        const sender = match[4];
        const message = match[5];

        // 重新构建标准格式的消息
        const formattedMessage = `[${datePart}, ${timePart}] ${sender}: ${message}`;
        messages.push(formattedMessage);
      }

      if (messages.length > 0) {
        console.log(`使用正则表达式提取的消息数: ${messages.length}`);
        lines = messages;
      }
    }
  }

  // 清理行
  lines = lines.map(line => line.trim());

  // 如果需要移除空行
  if (removeEmpty) {
    lines = lines.filter(line => line.length > 0);
  }

  console.log(`分割后行数: ${lines.length}`);

  return lines;
}

/**
 * 计算两个字符串的相似度（Levenshtein 距离）
 * @param a 第一个字符串
 * @param b 第二个字符串
 * @returns 相似度（0-1，1表示完全相同）
 */
export function stringSimilarity(a: string, b: string): number {
  if (a.length === 0) return b.length === 0 ? 1 : 0;
  if (b.length === 0) return 0;

  const matrix: number[][] = [];

  // 初始化矩阵
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  // 填充矩阵
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // 删除
        matrix[i][j - 1] + 1,      // 插入
        matrix[i - 1][j - 1] + cost // 替换
      );
    }
  }

  // 计算相似度
  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);

  return 1 - distance / maxLength;
}

/**
 * 检测文本是否包含特定模式
 * @param text 输入文本
 * @param patterns 模式数组
 * @returns 是否包含任一模式
 */
export function containsAnyPattern(text: string, patterns: string[]): boolean {
  return patterns.some(pattern => text.includes(pattern));
}

/**
 * 提取文本中的日期时间部分
 * @param text 输入文本
 * @returns 提取的日期时间部分，如果没有则返回 null
 */
export function extractDateTimePart(text: string): { datePart: string, timePart: string } | null {
  // 尝试匹配常见的日期时间格式
  const patterns = [
    /\[([^,\]]+),\s*([^\]]+)\]/, // [日期, 时间]
    /\(([^,\)]+),\s*([^\)]+)\)/, // (日期, 时间)
    /(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP][mM])?)/  // 日期, 时间
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        datePart: match[1].trim(),
        timePart: match[2].trim()
      };
    }
  }

  return null;
}

/**
 * 提取日期部分
 * @param datePart 日期部分字符串
 * @returns 日期部分对象
 */
export function extractDateParts(datePart: string): { day: number; month: number; year: number } {
  // 尝试匹配不同的日期格式
  const formats = [
    // DD/MM/YYYY
    /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/,
    // MM/DD/YYYY
    /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/,
    // YYYY/MM/DD
    /^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/
  ];

  for (const format of formats) {
    const match = datePart.match(format);

    if (match) {
      let day: number, month: number, year: number;

      if (format === formats[0]) {
        // DD/MM/YYYY
        day = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        year = parseInt(match[3], 10);
      } else if (format === formats[1]) {
        // MM/DD/YYYY
        month = parseInt(match[1], 10);
        day = parseInt(match[2], 10);
        year = parseInt(match[3], 10);
      } else {
        // YYYY/MM/DD
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        day = parseInt(match[3], 10);
      }

      // 处理两位数年份
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }

      return { day, month, year };
    }
  }

  // 默认返回当前日期
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}
