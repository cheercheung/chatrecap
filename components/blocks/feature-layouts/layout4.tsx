"use client";

import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Clock, BarChart } from 'lucide-react';

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface FeatureBlockLayout4Props {
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

const FeatureBlockLayout4 = forwardRef<HTMLDivElement, FeatureBlockLayout4Props>(
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

          {/* Features Tabs */}
          {features.length > 0 && (
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <Tabs defaultValue={`tab-0`} className="w-full">
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
                    {features.map((feature, index) => (
                      <TabsTrigger key={index} value={`tab-${index}`} className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1 text-primary">
                          {getDefaultIcon(index)}
                        </div>
                        <span>{feature.title}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {features.map((feature, index) => (
                    <TabsContent key={index} value={`tab-${index}`} className="p-4 bg-background/50 rounded-lg">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.content}</p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }
);

FeatureBlockLayout4.displayName = 'FeatureBlockLayout4';

export default FeatureBlockLayout4;
