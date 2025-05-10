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
      console.log("Plan selected:", plan); // 添加调试信息
      setIsLoading(true);
      setSelectedPlanId(plan.productId);

      // 从环境变量中获取产品ID
      const basicProductId = process.env.NEXT_PUBLIC_BASIC_PRODUCT_ID || "prod_e9TcCKZ6qDESAWaWJb6TO";
      const premiumProductId = process.env.NEXT_PUBLIC_PREMIUM_PRODUCT_ID || "prod_e9TcCKZ6qDESAWaWJb6TO";

      // 根据计划标题确定产品ID和金额
      const isPremiumPlan = plan.title?.includes("9.9") || plan.price?.includes("9.9");

      // 设置支付参数
      const params = {
        amount: isPremiumPlan ? 990 : 490, // 9.9元或4.9元
        product_id: isPremiumPlan ? premiumProductId : basicProductId, // 根据计划选择产品ID
        user_id: "b0f9ded6-ccfb-4897-a7ed-fae70f9a7da0" // 使用测试用户ID
      };

      console.log("创建支付会话，参数:", params);
      toast.info("正在创建支付会话...");

      // 调用支付API
      const response = await fetch("/api/creem-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const responseData = await response.json();
      console.log('Payment API response data:', responseData);

      const { success, message, data } = responseData;

      if (!success) {
        console.error('Payment session creation failed:', message);
        toast.error(message || "支付创建失败");
        return;
      }

      // 显示成功消息
      toast.success("支付会话创建成功，即将跳转...");

      // 延迟1秒后跳转，以便看到提示
      setTimeout(() => {
        // 重定向到Creem支付页面
        window.location.href = data.checkout_url;
      }, 1000);

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
                    ? "border-primary/70 border-2 shadow-lg bg-gradient-to-b from-primary/10 to-transparent scale-105 transform z-10"
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
                    <h3 className={`text-2xl font-bold mb-3 ${plan.isPopular ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-3xl" : "text-primary"}`}>{planTitle}</h3>
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
                      className={`w-full text-base py-6 font-medium ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl border-0 animate-pulse"
                          : ""
                      }`}
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
                          loading
                        </span>
                      ) : (
                        <>
                          {plan.isPopular ? (
                            <span className="flex items-center justify-center">
                              <span className="mr-2">🔥</span>
                              {planButtonText}
                              <span className="ml-2">🔥</span>
                            </span>
                          ) : (
                            <>
                              {planButtonText}
                              {plan.buttonIcon && (
                                <Icon name={plan.buttonIcon} className="ml-2" />
                              )}
                            </>
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