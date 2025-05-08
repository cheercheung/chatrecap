import { LandingPage } from "@/types/pages/landing";
// 导入静态翻译
import { landingTranslations } from '@/lib/static-translations';

// 缓存对象，使用 Map 提高查找性能
// 键为语言代码，值为页面数据和过期时间
const pageCache = new Map<string, { data: LandingPage; expiry: number }>();

// 缓存有效期（毫秒）- 增加到24小时，减少重新加载频率
const CACHE_TTL = 24 * 60 * 60 * 1000;

// 支持的语言列表
const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'tr', 'de', 'ko', 'fr', 'ja'];

// 预加载英文数据
let preloadedEnData: LandingPage | null = null;

// 在服务器启动时预加载英文数据
if (typeof window === 'undefined') {
  // 使用静态翻译，不再动态导入
  const rawData = landingTranslations.landing;
  const commonData = landingTranslations.common;

  // 将 header.nav.items 从对象转换为数组
  const headerNavItems = commonData.header?.nav?.items;
  const navItemsArray = headerNavItems ? Object.keys(headerNavItems).map(key => ({
    title: headerNavItems[key],
    url: `/${key.replace(/_/g, '-')}`,
    target: ""
  })) : [];

  // 将 header.buttons 从对象转换为数组
  const headerButtons = commonData.header?.buttons;
  const buttonsArray = headerButtons ? Object.keys(headerButtons).map(key => ({
    title: headerButtons[key],
    url: key === "try_free" ? "/chatrecapanalysis" : "/signin",
    variant: key === "try_free" ? "default" : "outline",
    target: ""
  })) : [];

  // 处理 footer 部分
  const footerSocial = commonData.footer?.social;
  const socialItemsArray = footerSocial ? Object.keys(footerSocial).map(key => ({
    title: footerSocial[key],
    url: `https://${key}.com/chatrecapio`,
    icon: key,
    target: "_blank"
  })) : [];

  const footerLinks = commonData.footer?.links;
  const agreementItemsArray = footerLinks ? Object.keys(footerLinks).map(key => ({
    title: footerLinks[key],
    url: `/${key.replace(/_/g, '-')}`,
    target: ""
  })) : [];

  // 确保 hero.show_happy_users 属性被正确设置
  if (rawData.hero) {
    // 使用类型断言来避免类型错误
    (rawData.hero as any).show_happy_users = true;
  }

  // 合并 landing 和 common 数据
  const mergedData = {
    ...rawData,
    header: {
      ...commonData.header,
      nav: {
        ...commonData.header?.nav,
        items: navItemsArray
      },
      buttons: buttonsArray
    },
    footer: {
      ...commonData.footer,
      social: {
        items: socialItemsArray
      },
      agreement: {
        items: agreementItemsArray
      }
    }
  };

  preloadedEnData = validateAndFixLandingPageData(mergedData);
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
 * 获取落地页数据，使用静态翻译
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

  // 缓存未命中或已过期，使用静态翻译
  try {
    // 使用静态翻译，不再动态导入
    const rawData = landingTranslations.landing;

    // 从 common 翻译中获取 header 和 footer 数据
    const commonData = landingTranslations.common;

    // 合并 landing 和 common 数据
    // 将 header.nav.items 从对象转换为数组
    const headerNavItems = commonData.header?.nav?.items;
    const navItemsArray = headerNavItems ? Object.keys(headerNavItems).map(key => ({
      title: headerNavItems[key],
      url: `/${key.replace(/_/g, '-')}`,
      target: ""
    })) : [];

    // 将 header.buttons 从对象转换为数组
    const headerButtons = commonData.header?.buttons;
    const buttonsArray = headerButtons ? Object.keys(headerButtons).map(key => ({
      title: headerButtons[key],
      url: key === "try_free" ? "/chatrecapanalysis" : "/signin",
      variant: key === "try_free" ? "default" : "outline",
      target: ""
    })) : [];

    // 处理 footer 部分
    const footerSocial = commonData.footer?.social;
    const socialItemsArray = footerSocial ? Object.keys(footerSocial).map(key => ({
      title: footerSocial[key],
      url: `https://${key}.com/chatrecapio`,
      icon: key,
      target: "_blank"
    })) : [];

    const footerLinks = commonData.footer?.links;
    const agreementItemsArray = footerLinks ? Object.keys(footerLinks).map(key => ({
      title: footerLinks[key],
      url: `/${key.replace(/_/g, '-')}`,
      target: ""
    })) : [];

    // 确保 hero.show_happy_users 属性被正确设置
    if (rawData.hero) {
      // 使用类型断言来避免类型错误
      (rawData.hero as any).show_happy_users = true;
    }

    const mergedData = {
      ...rawData,
      header: {
        ...commonData.header,
        nav: {
          ...commonData.header?.nav,
          items: navItemsArray
        },
        buttons: buttonsArray
      },
      footer: {
        ...commonData.footer,
        social: {
          items: socialItemsArray
        },
        agreement: {
          items: agreementItemsArray
        }
      }
    };

    // 验证数据是否符合 LandingPage 接口
    if (!isLandingPage(mergedData)) {
      throw new Error(`Invalid landing page data`);
    }

    // 验证并修复数据，确保类型兼容
    const data = validateAndFixLandingPageData(mergedData);

    // 更新缓存
    pageCache.set(safeLocale, {
      data,
      expiry: now + CACHE_TTL
    });

    return data;
  } catch (error) {
    console.warn(`Failed to load landing data, using preloaded data`);

    // 使用预加载的英文数据（如果可用）
    if (preloadedEnData) {
      // 更新英文缓存
      pageCache.set('en', {
        data: preloadedEnData,
        expiry: now + CACHE_TTL
      });

      return preloadedEnData;
    }

    // 如果没有预加载数据，返回一个最小的有效 LandingPage 对象
    console.error('No preloaded data available');
    return {};
  }
}
