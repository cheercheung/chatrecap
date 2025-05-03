/**
 * 检测 WhatsApp 日期格式
 * @param datePart 日期部分
 * @returns 日期格式字符串
 */
export function detectWhatsAppDateFormat(datePart: string): string {
  // 检查日期格式
  if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(datePart)) {
    // 对于 13/03/25 这样的格式，第一个数字 > 12 表示这是 DD/MM/YY 格式
    const parts = datePart.split('/');
    const first = parseInt(parts[0], 10);
    if (first > 12) {
      return 'DD/MM/YY, HH:mm:ss'; // 13/03/25 格式 (西班牙语等欧洲格式)
    }
    return 'MM/DD/YY, HH:mm:ss'; // 12/3/24 格式 (美式格式)
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(datePart)) {
    // 对于 13/03/2025 这样的格式，第一个数字 > 12 表示这是 DD/MM/YYYY 格式
    const parts = datePart.split('/');
    const first = parseInt(parts[0], 10);
    if (first > 12) {
      return 'DD/MM/YYYY, HH:mm:ss'; // 13/03/2025 格式 (西班牙语等欧洲格式)
    }
    return 'MM/DD/YYYY, HH:mm:ss'; // 12/3/2024 格式 (美式格式)
  } else if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(datePart)) {
    return 'YYYY/MM/DD, HH:mm:ss'; // 2024/12/3 格式
  }

  // 默认使用 DD/MM/YY 格式，因为大多数国家使用这种格式
  return 'DD/MM/YY, HH:mm:ss';
}

/**
 * 处理两位数年份，转换为四位数年份
 * @param year 原始年份
 * @returns 处理后的年份
 */
export function normalizeYear(year: number): number {
  if (year >= 100) return year;

  // 处理两位数年份
  const currentYear = new Date().getFullYear();
  const century = Math.floor(currentYear / 100) * 100;
  year = year + century;

  if (year > currentYear + 50) {
    year -= 100; // 如果年份超过当前年份50年，假设是上个世纪
  }

  return year;
}

/**
 * 处理小时，考虑AM/PM
 * @param hour 原始小时
 * @param ampm AM/PM 标识
 * @returns 处理后的小时
 */
export function normalizeHour(hour: number, ampm: string | null): number {
  if (!ampm) return hour;

  if (ampm === 'pm' && hour < 12) {
    return hour + 12;
  } else if (ampm === 'am' && hour === 12) {
    return 0;
  }

  return hour;
}

/**
 * 解析日期部分
 * @param datePart 日期部分字符串
 * @returns 解析后的日期对象，如果解析失败则返回 undefined
 */
export function parseDatePart(datePart: string): { day: number; month: number; year: number } | undefined {
  // 尝试匹配不同的日期格式
  const dateMatch = datePart.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (!dateMatch) {
    console.warn(`无法解析日期部分: ${datePart}`);
    return undefined;
  }

  let day: number, month: number, year: number;

  // 检查日期格式
  const format = detectWhatsAppDateFormat(datePart);
  console.log(`检测到的日期格式: ${format} 用于 ${datePart}`);

  if (format.startsWith('MM/DD')) {
    // MM/DD/YY 或 MM/DD/YYYY 格式
    month = parseInt(dateMatch[1], 10);
    day = parseInt(dateMatch[2], 10);
  } else if (format.startsWith('DD/MM')) {
    // DD/MM/YY 或 DD/MM/YYYY 格式
    day = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10);
  } else if (format.startsWith('YYYY')) {
    // YYYY/MM/DD 格式
    year = parseInt(dateMatch[1], 10);
    month = parseInt(dateMatch[2], 10);
    day = parseInt(dateMatch[3], 10);
    return { day, month, year };
  } else {
    // 尝试确定日期格式（MM/DD/YY 或 DD/MM/YY）
    const first = parseInt(dateMatch[1], 10);
    const second = parseInt(dateMatch[2], 10);

    // 如果第一个数字 > 12，那么它可能是日而不是月
    if (first > 12) {
      day = first;
      month = second;
    } else if (second > 12) {
      // 如果第二个数字 > 12，那么它可能是日而不是月
      month = first;
      day = second;
    } else {
      // 如果两个数字都 <= 12，优先使用 DD/MM 格式，因为大多数国家使用这种格式
      day = first;
      month = second;

      // 特殊处理西班牙语格式 (13/03/25, 11:38:24 p.m.)
      if (datePart.includes('/') && dateMatch[3].length === 2) {
        // 检查时间部分是否包含 a.m. 或 p.m.
        const fullText = datePart + (datePart.includes(',') ? '' : ', ');
        if (fullText.includes('a.m.') || fullText.includes('p.m.') ||
            fullText.includes('A.M.') || fullText.includes('P.M.')) {
          console.log(`检测到西班牙语格式: ${datePart}`);
          day = first;
          month = second;
        }
      }
    }
  }

  // 解析年份
  year = normalizeYear(parseInt(dateMatch[3], 10));

  console.log(`解析结果: 日=${day}, 月=${month}, 年=${year}`);
  return { day, month, year };
}

/**
 * 解析时间部分
 * @param timePart 时间部分字符串
 * @returns 解析后的时间对象，如果解析失败则返回 undefined
 */
export function parseTimePart(timePart: string): { hour: number; minute: number; second: number } | undefined {
  // 首先检查西班牙语格式 (11:38:24 p.m.)
  const spanishMatch = timePart.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*(a\.m\.|p\.m\.|A\.M\.|P\.M\.)?)?/);
  if (spanishMatch) {
    let hour = parseInt(spanishMatch[1], 10);
    const minute = parseInt(spanishMatch[2], 10);
    const second = spanishMatch[3] ? parseInt(spanishMatch[3], 10) : 0;

    // 处理 a.m./p.m.
    const ampmStr = spanishMatch[4] ? spanishMatch[4].toLowerCase() : null;
    let ampm = null;

    if (ampmStr) {
      if (ampmStr.includes('p.m.') || ampmStr.includes('p.m')) {
        ampm = 'pm';
      } else if (ampmStr.includes('a.m.') || ampmStr.includes('a.m')) {
        ampm = 'am';
      }
    }

    // 处理 AM/PM
    hour = normalizeHour(hour, ampm);

    console.log(`解析时间部分: ${timePart} => 小时=${hour}, 分钟=${minute}, 秒=${second}, AM/PM=${ampm}`);
    return { hour, minute, second };
  }

  // 标准格式
  const timeMatch = timePart.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*([aApP][mM])?)?/);
  if (!timeMatch) {
    console.warn(`无法解析时间部分: ${timePart}`);
    return undefined;
  }

  let hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const second = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
  const ampm = timeMatch[4] ? timeMatch[4].toLowerCase() : null;

  // 处理 AM/PM
  hour = normalizeHour(hour, ampm);

  return { hour, minute, second };
}

/**
 * 创建并验证日期对象
 * @param year 年
 * @param month 月
 * @param day 日
 * @param hour 时
 * @param minute 分
 * @param second 秒
 * @returns 日期对象，如果无效则返回 undefined
 */
export function createValidDate(year: number, month: number, day: number, hour: number, minute: number, second: number): Date | undefined {
  // 创建日期对象
  const date = new Date(year, month - 1, day, hour, minute, second);

  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    console.warn(`创建的日期无效: ${date}`);
    return undefined;
  }

  return date;
}

/**
 * 解析 WhatsApp 日期时间
 * @param datePart 日期部分
 * @param timePart 时间部分
 * @returns 解析后的日期对象，如果解析失败则返回当前日期
 */
export function parseWhatsAppDateTime(datePart: string, timePart: string): Date {
  try {
    // 如果日期部分或时间部分为空，使用当前日期时间
    if (!datePart || !timePart) {
      console.warn(`日期或时间部分为空: datePart=${datePart}, timePart=${timePart}`);
      return new Date(); // 返回当前日期时间
    }

    // 特殊处理英文月份名格式 (april 2nd 2025 1:20pm)
    const englishMonthNames: Record<string, number> = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };

    const englishMonthMatch = datePart.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d+)(?:st|nd|rd|th)?\s+(\d{4})$/i);

    if (englishMonthMatch) {
      console.log(`检测到英文月份名格式: ${datePart}, ${timePart}`);

      const monthName = englishMonthMatch[1].toLowerCase();
      const day = parseInt(englishMonthMatch[2], 10);
      const year = parseInt(englishMonthMatch[3], 10);
      const month = englishMonthNames[monthName as keyof typeof englishMonthNames];

      // 解析时间部分 (1:20pm)
      const timeMatch = timePart.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*([aApP][mM])?)?/);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const second = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

        // 处理 AM/PM
        const ampm = timeMatch[4] ? timeMatch[4].toLowerCase() : null;

        // 处理 AM/PM
        hour = normalizeHour(hour, ampm);

        // 创建日期对象
        const date = new Date(year, month, day, hour, minute, second);

        // 验证日期是否有效
        if (!isNaN(date.getTime())) {
          console.log(`成功解析英文月份名格式日期: ${date.toISOString()}`);
          return date;
        }
      }
    }

    // 特殊处理西班牙语格式 (13/03/25, 11:38:24 p.m.)
    if (datePart.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/) &&
        (timePart.includes('a.m.') || timePart.includes('p.m.') ||
         timePart.includes('A.M.') || timePart.includes('P.M.'))) {

      console.log(`检测到西班牙语格式: ${datePart}, ${timePart}`);

      // 解析日期部分 (DD/MM/YY)
      const dateMatch = datePart.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
      if (dateMatch) {
        const day = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1; // Month is 0-based in JS Date
        let year = parseInt(dateMatch[3], 10);

        // 转换两位数年份为四位数
        year = normalizeYear(year);

        // 解析时间部分 (HH:MM:SS p.m.)
        const timeMatch = timePart.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*(a\.m\.|p\.m\.|A\.M\.|P\.M\.)?)?/);
        if (timeMatch) {
          let hour = parseInt(timeMatch[1], 10);
          const minute = parseInt(timeMatch[2], 10);
          const second = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

          // 处理 AM/PM
          const ampmStr = timeMatch[4] ? timeMatch[4].toLowerCase() : null;
          let ampm = null;

          if (ampmStr) {
            if (ampmStr.includes('p.m.') || ampmStr.includes('p.m')) {
              ampm = 'pm';
            } else if (ampmStr.includes('a.m.') || ampmStr.includes('a.m')) {
              ampm = 'am';
            }
          }

          // 处理 AM/PM
          hour = normalizeHour(hour, ampm);

          // 创建日期对象
          const date = new Date(year, month, day, hour, minute, second);

          // 验证日期是否有效
          if (!isNaN(date.getTime())) {
            console.log(`成功解析西班牙语格式日期: ${date.toISOString()}`);
            return date;
          }
        }
      }
    }

    // 尝试直接解析完整的日期时间字符串
    const fullDateTimeStr = `${datePart}, ${timePart}`;
    const directDate = new Date(fullDateTimeStr);
    if (!isNaN(directDate.getTime())) {
      return directDate;
    }

    // 如果直接解析失败，尝试使用更复杂的解析逻辑
    // 解析日期部分
    const dateResult = parseDatePart(datePart);
    if (!dateResult) {
      console.warn(`无法解析日期部分: ${datePart}`);
      return new Date(); // 返回当前日期时间
    }

    // 解析时间部分
    const timeResult = parseTimePart(timePart);
    if (!timeResult) {
      console.warn(`无法解析时间部分: ${timePart}`);
      return new Date(); // 返回当前日期时间
    }

    const { day, month, year } = dateResult;
    const { hour, minute, second } = timeResult;

    // 创建并验证日期对象
    const date = createValidDate(year, month, day, hour, minute, second);
    if (!date) {
      console.warn(`创建的日期无效: year=${year}, month=${month}, day=${day}, hour=${hour}, minute=${minute}, second=${second}`);
      return new Date(); // 返回当前日期时间
    }

    return date;
  } catch (error) {
    console.error(`解析日期时间时出错: ${error}`);
    return new Date(); // 返回当前日期时间
  }
}
