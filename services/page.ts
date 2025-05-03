import { LandingPage } from "@/types/pages/landing";

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

export async function getLandingPage(locale: string): Promise<LandingPage> {
  try {
    if (locale === "zh-CN") {
      locale = "zh";
    }

    const module = await import(`@/i18n/pages/landing/${locale.toLowerCase()}.json`);
    const data = module.default;

    // 验证数据是否符合 LandingPage 接口
    if (!isLandingPage(data)) {
      throw new Error(`Invalid landing page data for locale: ${locale}`);
    }

    return data;
  } catch (error) {
    console.warn(`Failed to load ${locale}.json, falling back to en.json`);

    try {
      const module = await import("@/i18n/pages/landing/en.json");
      const data = module.default;

      // 验证数据是否符合 LandingPage 接口
      if (!isLandingPage(data)) {
        throw new Error('Invalid landing page data for fallback locale: en');
      }

      return data;
    } catch (fallbackError) {
      console.error('Failed to load fallback landing page:', fallbackError);
      // 返回一个最小的有效 LandingPage 对象
      return {};
    }
  }
}
