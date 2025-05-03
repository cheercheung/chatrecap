// 导入 locale 配置
const { locales, defaultLocale, localeDetection } = require('./i18n/locale');

module.exports = {
  // 默认语言
  defaultLocale,
  // 支持的语言列表
  locales,
  // 本地化检测
  localeDetection,
};
