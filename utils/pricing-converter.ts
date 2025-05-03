import { Pricing, PricingItem } from "@/types/blocks/pricing";
import { PricingFeature, PricingPlan } from "@/types/blocks/simple-pricing";

/**
 * 将原始Pricing格式转换为SimplePricing格式
 * @param pricing 原始Pricing数据
 * @returns SimplePricing格式的数据
 */
export function convertToSimplePricing(pricing: Pricing): {
  title: string;
  description: string;
  plans: PricingPlan[];
} {
  if (!pricing || !pricing.items) {
    return {
      title: "",
      description: "",
      plans: [],
    };
  }

  const title = pricing.title || "";
  const description = pricing.description || "";

  // 转换每个价格项
  const plans: PricingPlan[] = pricing.items.map((item: PricingItem) => {
    // 转换功能列表
    const features: PricingFeature[] = (item.features || []).map((feature: any) => {
      // 处理两种可能的格式：字符串或已经是对象
      if (typeof feature === 'string') {
        return { text: feature };
      } else if (typeof feature === 'object' && feature.text) {
        return { text: feature.text };
      } else {
        return { text: String(feature) };
      }
    });

    return {
      title: item.title || "",
      description: item.description || "",
      price: item.price || "$0",
      originalPrice: item.original_price,
      features: features,
      isPopular: item.is_featured,
      popularLabel: item.label,
      buttonText: item.button?.title || "Get Started",
      buttonUrl: item.button?.url || "/#signup",
      buttonIcon: item.button?.icon,
      productId: item.product_id,
      isFree: item.amount === 0,
      tipText: item.tip,
      amount: item.amount, // 添加金额参数，用于支付处理
    };
  });

  return {
    title,
    description,
    plans,
  };
}
