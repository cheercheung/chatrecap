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
 */
export function formatTimespan(startDate: Date | any, endDate: Date | any): string {
  try {
    // 确保 startDate 和 endDate 是有效的 Date 对象
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      console.warn('无效的开始日期，使用当前日期减去30天');
      const now = new Date();
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      console.warn('无效的结束日期，使用当前日期');
      endDate = new Date();
    }

    // 确保开始日期在结束日期之前
    if (startDate.getTime() > endDate.getTime()) {
      console.warn('开始日期在结束日期之后，交换两个日期');
      [startDate, endDate] = [endDate, startDate];
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const startDay = startDate.getDate();
    const startMonth = monthNames[startDate.getMonth()];
    const startYear = startDate.getFullYear();
    const startDayName = dayNames[startDate.getDay()];

    const endDay = endDate.getDate();
    const endMonth = monthNames[endDate.getMonth()];
    const endYear = endDate.getFullYear();
    const endDayName = dayNames[endDate.getDay()];

    const durationInDays = Math.max(1, Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ));

    let durationText;
    if (durationInDays < 30) {
      durationText = `${durationInDays} days`;
    } else if (durationInDays < 365) {
      const months = Math.floor(durationInDays / 30);
      durationText = `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(durationInDays / 365);
      const remainingMonths = Math.floor((durationInDays % 365) / 30);
      if (remainingMonths === 0) {
        durationText = `${years} ${years === 1 ? 'year' : 'years'}`;
      } else {
        durationText = `${years} ${years === 1 ? 'year' : 'years'} and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
    }

    return `Your story began on ${startMonth} ${startDay}, ${startYear} ${startDayName} 00:00, unfolding over ${durationText}, until ${endMonth} ${endDay}, ${endYear} ${endDayName} 23:59—leaving an everlasting mark in the passage of time.`;
  } catch (error) {
    console.error('格式化时间跨度时出错:', error);
    return 'Your story unfolded over time, leaving an everlasting mark in the passage of time.';
  }
}
