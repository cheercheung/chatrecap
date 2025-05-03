"use client";

import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, Clock, BarChart } from 'lucide-react';

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface FeatureBlockLayout5Props {
  title: string;
  features: FeatureItem[];
  className?: string;
}

// 根据索引获取默认图标
const getDefaultIcon = (index: number) => {
  const icons = [
    <MessageSquare key="message" className="h-5 w-5" />,
    <Clock key="clock" className="h-5 w-5" />,
    <BarChart key="chart" className="h-5 w-5" />
  ];
  return icons[index % icons.length];
};

const FeatureBlockLayout5 = forwardRef<HTMLDivElement, FeatureBlockLayout5Props>(
  ({ title, features, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="space-y-6">
          {/* Title Card */}
          <Card className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-center">
                {title}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Features Accordion */}
          {features.length > 0 && (
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {features.map((feature, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1 text-primary mr-2">
                          {getDefaultIcon(index)}
                        </div>
                        <span>{feature.title}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2">
                        <p className="text-muted-foreground">{feature.content}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }
);

FeatureBlockLayout5.displayName = 'FeatureBlockLayout5';

export default FeatureBlockLayout5;
