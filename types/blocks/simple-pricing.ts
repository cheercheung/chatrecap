export interface PricingFeature {
  text: string;
  textKey?: string; // Translation key for the feature text
}

export interface PricingPlan {
  title: string;
  titleKey?: string; // Translation key for the title
  description: string;
  descriptionKey?: string; // Translation key for the description
  price: string;
  priceKey?: string; // Translation key for the price
  originalPrice?: string;
  originalPriceKey?: string; // Translation key for the original price
  features: PricingFeature[];
  isPopular?: boolean;
  popularLabel?: string;
  popularLabelKey?: string; // Translation key for the popular label
  buttonText: string;
  buttonTextKey?: string; // Translation key for the button text
  buttonUrl: string;
  buttonIcon?: string;
  productId: string;
  isFree?: boolean;
  tipText?: string;
  tipTextKey?: string; // Translation key for the tip text
  amount?: number; // 添加金额参数，用于支付处理
}

export interface SimplePricing {
  title: string;
  titleKey?: string; // Translation key for the title
  description: string;
  descriptionKey?: string; // Translation key for the description
  subtitle?: string; // Subtitle text displayed below the title
  subtitleKey?: string; // Translation key for the subtitle
  plans: PricingPlan[];
}
