"use client";

import React, { useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { DashboardPageProps } from "@/types/dashboard";
import DashboardOverview from "./overview";
import PointsHistory from "./points-history";
import AnalysisHistory from "./analysis-history";
import { Sidebar } from "@/types/blocks/sidebar";
import DashboardClientLayout from "@/components/dashboard/client-layout";

type DashboardView = "overview" | "points" | "history";

interface DashboardClientWrapperProps {
  data: DashboardPageProps;
  messages: Record<string, any>;
  locale: string;
}

/**
 * 仪表盘客户端包装组件 (新版)
 *
 * 使用 NextIntlClientProvider 提供翻译上下文
 * 处理侧边栏导航和视图切换
 */
const DashboardClientWrapperNew: React.FC<DashboardClientWrapperProps> = ({
  data,
  messages,
  locale
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  // 创建一个简单的翻译函数，用于侧边栏配置
  // 这里我们直接从传入的 messages 中获取翻译
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = messages;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // 如果找不到翻译，返回原始键
      }
    }

    return typeof result === 'string' ? result : key;
  };

  // 创建侧边栏配置
  const sidebar: Sidebar = {
    brand: {
      title: "Chat Recap",
      logo: {
        src: "/logo.png",
        alt: "Chat Recap Logo"
      },
      url: "/"
    },
    nav: {
      items: [
        {
          title: t("dashboard"),
          icon: "dashboard",
          url: "javascript:void(0)",
          is_active: currentView === "overview",
          onClick: () => setCurrentView("overview")
        },
        {
          title: t("credits.title"),
          icon: "credit-card",
          url: "javascript:void(0)",
          is_active: currentView === "points",
          onClick: () => setCurrentView("points")
        },
        {
          title: t("history.title"),
          icon: "history",
          url: "javascript:void(0)",
          is_active: currentView === "history",
          onClick: () => setCurrentView("history")
        },
        {
          title: t("new_analysis"),
          icon: "analysis",
          url: "/chatrecapanalysis"
        }
      ]
    }
  };

  // 根据当前视图渲染对应的组件
  const renderContent = () => {
    // 直接使用 messages 作为翻译消息，不需要嵌套在 dashboard 命名空间下
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {(() => {
          switch (currentView) {
            case "overview":
              return <DashboardOverview {...data} />;
            case "points":
              return <PointsHistory creditHistory={data.creditHistory} />;
            case "history":
              return <AnalysisHistory analysisHistory={data.analysisHistory} />;
            default:
              return <DashboardOverview {...data} />;
          }
        })()}
      </NextIntlClientProvider>
    );
  };

  return (
    <DashboardClientLayout sidebar={sidebar}>
      {renderContent()}
    </DashboardClientLayout>
  );
};

export default DashboardClientWrapperNew;
