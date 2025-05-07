/**
 * 日期处理工具函数
 */

/**
 * 格式化日期为长格式
 * 例如: "January 1, 2023"
 */
export function formatDateLong(date: Date | any): string {
  try {
    // 确保 date 是一个有效的 Date 对象
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('无效的日期对象，使用当前日期');
      date = new Date();
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('格式化日期时出错:', error);
    return new Date().toLocaleDateString('en-US');
  }
}

/**
 * 格式化日期为短格式
 * 例如: "2023-01-01"
 */
export function formatDateShort(date: Date | any): string {
  try {
    // 确保 date 是一个有效的 Date 对象
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('无效的日期对象，使用当前日期');
      date = new Date();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('格式化日期时出错:', error);
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
}

/**
 * 格式化时间跨度为描述性文本
 * 返回翻译键，前端负责翻译
 */
export function formatTimespan(startDate: Date | any, endDate: Date | any): string {
  try {
    // 确保 startDate 和 endDate 是有效的 Date 对象
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      console.warn('chatrecapresult.warnings.invalid_start_date');
      const now = new Date();
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      console.warn('chatrecapresult.warnings.invalid_end_date');
      endDate = new Date();
    }

    // 确保开始日期在结束日期之前
    if (startDate.getTime() > endDate.getTime()) {
      console.warn('chatrecapresult.warnings.dates_swapped');
      [startDate, endDate] = [endDate, startDate];
    }

    // 我们不需要在后端计算这些值，只需返回翻译键
    // 前端将负责翻译和格式化

    // 返回翻译键和参数，前端负责翻译
    return 'chatrecapresult.timespan_summary';
  } catch (error) {
    console.error('chatrecapresult.errors.timespan_format_error', error);
    return 'chatrecapresult.timespan_fallback';
  }
}
