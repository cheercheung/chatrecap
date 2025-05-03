export interface PricingFeature {
  text: string;
}

export interface PricingPlan {
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: PricingFeature[];
  isPopular?: boolean;
  popularLabel?: string;
  buttonText: string;
  buttonUrl: string;
  buttonIcon?: string;
  productId: string;
  isFree?: boolean;
  tipText?: string;
  amount?: number; // 添加金额参数，用于支付处理
}

export interface SimplePricing {
  title: string;
  description: string;
  plans: PricingPlan[];
}