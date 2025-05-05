'use client';

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/icon";

// 定义价格组件的类型
interface PricingFeature {
  text: string;
}

interface PricingPlan {
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

interface SimplePricingProps {
  title: string;
  description: string;
  plans: PricingPlan[];
}

export default function SimplePricing({ title, description, plans }: SimplePricingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handlePlanSelection = async (plan: PricingPlan) => {
    try {
      setIsLoading(true);
      setSelectedPlanId(plan.productId);

      // 如果是免费计划或没有设置金额，直接跳转到按钮URL
      if (plan.isFree || !plan.amount) {
        window.location.href = plan.buttonUrl;
        return;
      }

      // 对于premium计划，直接跳转到chatrecapanalysis页面
      console.log('Redirecting to chatrecapanalysis page');

      // 获取当前语言
      const currentLocale = document.documentElement.lang || 'en';

      // 根据当前语言构建URL
      // 如果是默认语言(英语)，不需要添加语言前缀
      const redirectUrl = currentLocale === 'en'
        ? '/chatrecapanalysis'
        : `/${currentLocale}/chatrecapanalysis`;

      window.location.href = redirectUrl;

    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("页面跳转失败，请稍后再试");
    } finally {
      setIsLoading(false);
      setSelectedPlanId(null);
    }
  };

  return (
    <section id="pricing" className="py-16">
      <div className="container">
        <div className="mx-auto mb-12 text-center">
          <h2 className="mb-4 text-4xl font-semibold lg:text-5xl">{title}</h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {plans && Array.isArray(plans) ? plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.isPopular ? "border-primary border-2" : "border-muted"
              }`}
            >
              {plan.isPopular && plan.popularLabel && (
                <Badge
                  variant="default"
                  className="absolute top-4 right-4 z-10"
                >
                  {plan.popularLabel}
                </Badge>
              )}

              <div className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through mb-1">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-8 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Button
                    className="w-full"
                    onClick={() => handlePlanSelection(plan)}
                    disabled={isLoading && selectedPlanId === plan.productId}
                  >
                    {isLoading && selectedPlanId === plan.productId ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        处理中...
                      </span>
                    ) : (
                      <>
                        {plan.buttonText}
                        {plan.buttonIcon && (
                          <Icon name={plan.buttonIcon} className="ml-2" />
                        )}
                      </>
                    )}
                  </Button>

                  {plan.tipText && (
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      {plan.tipText}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No pricing plans available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}