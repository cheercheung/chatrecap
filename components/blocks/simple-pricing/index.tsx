'use client';

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// Remove the useTranslations import as we'll use direct props instead

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/icon";
import { PricingFeature, PricingPlan, SimplePricing as SimplePricingType } from "@/types/blocks/simple-pricing";

export default function SimplePricing({
  title,
  titleKey,
  description,
  descriptionKey,
  subtitle,
  subtitleKey,
  plans
}: SimplePricingType) {
  // No longer using useTranslations hook
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

  // 直接使用传入的值，不再使用翻译键
  const displayTitle = title;
  const displayDescription = description;
  const displaySubtitle = subtitle;

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto mb-16 text-center max-w-3xl">
          <h2 className="mb-3 text-4xl font-bold lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="mb-4 text-lg font-medium text-primary">
              {displaySubtitle}
            </p>
          )}
          <p className="text-muted-foreground lg:text-lg">
            {displayDescription}
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-16 max-w-6xl mx-auto">
          {plans && Array.isArray(plans) ? plans.map((plan, index) => {
            // 直接使用传入的值，不再使用翻译键
            const planTitle = plan.title;
            const planDescription = plan.description;
            const planPrice = plan.price;
            const planOriginalPrice = plan.originalPrice;
            const planPopularLabel = plan.popularLabel;
            const planButtonText = plan.buttonText;
            const planTipText = plan.tipText;

            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.isPopular
                    ? "border-primary/70 border-2 shadow-lg bg-gradient-to-b from-primary/5 to-transparent"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                {plan.isPopular && planPopularLabel && (
                  <Badge
                    variant="default"
                    className="absolute top-4 right-4 z-10 px-3 py-1 font-medium"
                  >
                    {planPopularLabel}
                  </Badge>
                )}

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-3 text-primary">{planTitle}</h3>
                    <p className="text-muted-foreground font-medium">{planDescription}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-primary">{planPrice}</span>
                      {planOriginalPrice && (
                        <span className="text-xl text-muted-foreground line-through mb-1">
                          {planOriginalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-10 flex-grow">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => {
                        // 直接使用传入的值，不再使用翻译键
                        const featureText = feature.text;

                        // Determine if this is a special feature that needs different styling
                        const isSpecialFeature = featureText.startsWith('💬') ||
                                               featureText.startsWith('🎯') ||
                                               featureText.startsWith('💰');

                        return (
                          <li key={featureIndex} className={`flex items-start gap-3 ${isSpecialFeature ? 'font-medium' : ''}`}>
                            {!isSpecialFeature && <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
                            <span className="text-sm lg:text-base">{featureText}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div>
                    <Button
                      className="w-full text-base py-6 font-medium"
                      size="lg"
                      variant={plan.isPopular ? "default" : "outline"}
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
                          {planButtonText}
                          {plan.buttonIcon && (
                            <Icon name={plan.buttonIcon} className="ml-2" />
                          )}
                        </>
                      )}
                    </Button>

                    {planTipText && (
                      <p className="text-sm text-primary/80 mt-4 text-center font-medium">
                        <span className="inline-block border-t border-primary/20 pt-3 px-8">
                          {planTipText}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          }) : (
            <div className="text-center p-8 col-span-2">
              <p className="text-muted-foreground">No pricing plans available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}