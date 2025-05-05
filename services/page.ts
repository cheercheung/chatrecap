import { LandingPage } from "@/types/pages/landing";

// 缓存对象，用于存储已加载的页面数据
// 键为语言代码，值为页面数据和过期时间
const pageCache: Record<string, { data: LandingPage; expiry: number }> = {};

// 缓存有效期（毫秒）- 1小时
const CACHE_TTL = 60 * 60 * 1000;

/**
 * 验证对象是否符合 LandingPage 接口
 * @param obj 要验证的对象
 * @returns 是否符合 LandingPage 接口
 */
function isLandingPage(obj: any): obj is LandingPage {
  return obj && typeof obj === 'object';
  // 注意：这里可以添加更严格的验证，例如检查必需的字段
  // 但由于 LandingPage 的所有字段都是可选的，简单的对象检查就足够了
}

/**
 * 获取落地页数据，带有内存缓存
 * @param locale 语言代码
 * @returns 落地页数据
 */
export async function getLandingPage(locale: string): Promise<LandingPage> {
  // 标准化语言代码
  if (locale === "zh-CN") {
    locale = "zh";
  }

  const normalizedLocale = locale.toLowerCase();

  // 检查缓存中是否有有效数据
  const now = Date.now();
  const cachedData = pageCache[normalizedLocale];

  if (cachedData && cachedData.expiry > now) {
    // 返回缓存的数据
    return cachedData.data;
  }

  // 缓存未命中或已过期，加载新数据
  try {
    // 使用 import() 动态加载语言文件
    // Next.js 会自动优化这些导入
    const module = await import(`@/i18n/pages/landing/${normalizedLocale}.json`);
    const data = module.default;

    // 验证数据是否符合 LandingPage 接口
    if (!isLandingPage(data)) {
      throw new Error(`Invalid landing page data for locale: ${locale}`);
    }

    // 更新缓存
    pageCache[normalizedLocale] = {
      data,
      expiry: now + CACHE_TTL
    };

    return data;
  } catch (error) {
    console.warn(`Failed to load ${normalizedLocale}.json, falling back to en.json`);

    // 尝试加载英文版本作为后备
    try {
      // 检查英文缓存
      const enCache = pageCache['en'];
      if (enCache && enCache.expiry > now) {
        return enCache.data;
      }

      const module = await import("@/i18n/pages/landing/en.json");
      const data = module.default;

      // 验证数据是否符合 LandingPage 接口
      if (!isLandingPage(data)) {
        throw new Error('Invalid landing page data for fallback locale: en');
      }

      // 更新英文缓存
      pageCache['en'] = {
        data,
        expiry: now + CACHE_TTL
      };

      return data;
    } catch (fallbackError) {
      console.error('Failed to load fallback landing page:', fallbackError);
      // 返回一个最小的有效 LandingPage 对象
      return {};
    }
  }
}
