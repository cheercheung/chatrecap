import { getRequestConfig } from "next-intl/server";
// import { routing } from "./routing";

// 只支持英语

export default getRequestConfig(async () => {
  // Always use English

  // 动态导入新的翻译文件系统
  let messages = {};
  try {
    // 导入公共翻译
    const commonMessages = (await import(`@/i18n/en/common.json`)).default;

    // 导入组件翻译
    const componentsMessages = (await import(`@/i18n/en/components.json`)).default;

    // 导入平台翻译
    const platformsMessages = (await import(`@/i18n/en/platforms.json`)).default;

    // 导入SEO翻译
    const seoMessages = (await import(`@/i18n/en/seo.json`)).default;

    // 导入错误信息翻译
    const errorsMessages = (await import(`@/i18n/en/errors.json`)).default;

    // 导入上传翻译
    const uploadMessages = (await import(`@/i18n/en/upload.json`)).default;

    // 导入结果页翻译
    const resultsMessages = (await import(`@/i18n/en/results.json`)).default;

    // 合并所有翻译
    messages = {
      common: commonMessages,
      components: componentsMessages,
      platforms: platformsMessages,
      seo: seoMessages,
      errors: errorsMessages,
      upload: uploadMessages,
      results: resultsMessages,
    };
  } catch (error) {
    console.warn(`Could not load translations: ${error}`);
    // 加载失败时，使用空对象
    messages = {};
  }

  return {
    locale: 'en',
    messages,
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
});
