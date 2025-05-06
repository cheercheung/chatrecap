import { LandingPage } from "@/types/pages/landing";

// 缓存对象，使用 Map 提高查找性能
// 键为语言代码，值为页面数据和过期时间
const pageCache = new Map<string, { data: LandingPage; expiry: number }>();

// 缓存有效期（毫秒）- 增加到24小时，减少重新加载频率
const CACHE_TTL = 24 * 60 * 60 * 1000;

// 支持的语言列表
const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'tr', 'de', 'ko', 'fr', 'ja'];

// 预加载英文数据的 Promise
let preloadedEnData: Promise<LandingPage> | null = null;

// 在服务器启动时预加载英文数据
if (typeof window === 'undefined') {
  preloadedEnData = import('@/i18n/pages/landing/en.json')
    .then(module => {
      // 确保数据符合 LandingPage 类型
      const data = module.default;
      return validateAndFixLandingPageData(data);
    })
    .catch(() => ({}));
}

/**
 * 验证并修复 LandingPage 数据，确保类型兼容
 * @param data 原始数据
 * @returns 修复后的数据
 */
function validateAndFixLandingPageData(data: any): LandingPage {
  if (!data) return {};

  // 创建一个新对象，避免修改原始数据
  const fixedData = { ...data };

  // 修复 header.buttons 中的 variant 属性
  if (fixedData.header?.buttons?.length) {
    fixedData.header.buttons = fixedData.header.buttons.map((button: any) => ({
      ...button,
      // 确保 variant 是有效的 ButtonVariant 类型
      variant: validateButtonVariant(button.variant)
    }));
  }

  // 修复 hero.buttons 中的 variant 属性
  if (fixedData.hero?.buttons?.length) {
    fixedData.hero.buttons = fixedData.hero.buttons.map((button: any) => ({
      ...button,
      // 确保 variant 是有效的 ButtonVariant 类型
      variant: validateButtonVariant(button.variant)
    }));
  }

  // 修复 footer.buttons 中的 variant 属性
  if (fixedData.footer?.buttons?.length) {
    fixedData.footer.buttons = fixedData.footer.buttons.map((button: any) => ({
      ...button,
      // 确保 variant 是有效的 ButtonVariant 类型
      variant: validateButtonVariant(button.variant)
    }));
  }

  // 修复 simple_pricing.plans: 将对象转换为数组，以适配 SimplePricing 组件
  if (fixedData.simple_pricing?.plans && !Array.isArray(fixedData.simple_pricing.plans)) {
    // 将 plans 对象值转换成数组
    fixedData.simple_pricing.plans = Object.values(fixedData.simple_pricing.plans);
  }
  // 修复每个 plan 的 features: 将对象转换为数组
  if (Array.isArray(fixedData.simple_pricing?.plans)) {
    fixedData.simple_pricing.plans = fixedData.simple_pricing.plans.map((plan: any) => {
      if (plan.features && !Array.isArray(plan.features)) {
        plan.features = Object.values(plan.features);
      }
      return plan;
    });
  }

  return fixedData;
}

/**
 * 验证按钮变体是否有效，如果无效则返回默认值
 * @param variant 按钮变体
 * @returns 有效的按钮变体
 */
function validateButtonVariant(variant: any): "secondary" | "link" | "default" | "destructive" | "outline" | "ghost" | null | undefined {
  const validVariants = ["secondary", "link", "default", "destructive", "outline", "ghost", null, undefined];
  return validVariants.includes(variant) ? variant : "default";
}

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
 * 获取落地页数据，带有内存缓存和预加载优化
 * @param locale 语言代码
 * @returns 落地页数据
 */
export async function getLandingPage(locale: string): Promise<LandingPage> {
  // 标准化语言代码
  if (locale === "en") {
    locale = "en";
  }

  // 确保语言代码有效
  const normalizedLocale = locale.toLowerCase();
  const isValidLocale = SUPPORTED_LOCALES.includes(normalizedLocale);
  const safeLocale = isValidLocale ? normalizedLocale : 'en';

  // 检查缓存中是否有有效数据
  const now = Date.now();
  const cachedData = pageCache.get(safeLocale);

  if (cachedData && cachedData.expiry > now) {
    // 返回缓存的数据
    return cachedData.data;
  }

  // 缓存未命中或已过期，加载新数据
  try {
    // 使用 import() 动态加载语言文件
    // Next.js 会自动优化这些导入
    const module = await import(`@/i18n/pages/landing/${safeLocale}.json`);
    const rawData = module.default;

    // 验证数据是否符合 LandingPage 接口
    if (!isLandingPage(rawData)) {
      throw new Error(`Invalid landing page data for locale: ${locale}`);
    }

    // 验证并修复数据，确保类型兼容
    const data = validateAndFixLandingPageData(rawData);

    // 更新缓存
    pageCache.set(safeLocale, {
      data,
      expiry: now + CACHE_TTL
    });

    return data;
  } catch (error) {
    console.warn(`Failed to load ${safeLocale}.json, falling back to en.json`);

    // 尝试加载英文版本作为后备
    try {
      // 检查英文缓存
      const enCache = pageCache.get('en');
      if (enCache && enCache.expiry > now) {
        return enCache.data;
      }

      // 使用预加载的英文数据（如果可用）
      if (preloadedEnData) {
        const data = await preloadedEnData;

        // 更新英文缓存
        pageCache.set('en', {
          data,
          expiry: now + CACHE_TTL
        });

        return data;
      }

      // 如果没有预加载数据，则动态加载
      const module = await import("@/i18n/pages/landing/en.json");
      const rawData = module.default;

      // 验证数据是否符合 LandingPage 接口
      if (!isLandingPage(rawData)) {
        throw new Error('Invalid landing page data for fallback locale: en');
      }

      // 验证并修复数据，确保类型兼容
      const data = validateAndFixLandingPageData(rawData);

      // 更新英文缓存
      pageCache.set('en', {
        data,
        expiry: now + CACHE_TTL
      });

      return data;
    } catch (fallbackError) {
      console.error('Failed to load fallback landing page:', fallbackError);
      // 返回一个最小的有效 LandingPage 对象
      return {};
    }
  }
}
