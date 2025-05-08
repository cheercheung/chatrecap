"use client";

import React, { useState } from "react";
import { DashboardPageProps } from "@/types/dashboard";
import DashboardOverview from "./static-overview";
import PointsHistory from "./static-points-history";
import AnalysisHistory from "./static-analysis-history";
import { Sidebar } from "@/types/blocks/sidebar";
import DashboardClientLayout from "@/components/dashboard/client-layout";

// 导入静态翻译和工具函数
import dashboardTranslations from '@/i18n/en/dashboard.json';
import { createStaticTranslator } from '@/lib/static-translation-utils';

type DashboardView = "overview" | "points" | "history";

interface DashboardStaticClientWrapperProps {
  data: DashboardPageProps;
}

/**
 * 仪表盘静态客户端包装组件
 *
 * 使用静态翻译而不是 useTranslations hook，避免国际化上下文问题
 */
const DashboardStaticClientWrapper: React.FC<DashboardStaticClientWrapperProps> = ({ data }) => {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  // 使用静态翻译工具函数创建翻译器
  const t = createStaticTranslator(dashboardTranslations);

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
  };

  return (
    <DashboardClientLayout sidebar={sidebar}>
      {renderContent()}
    </DashboardClientLayout>
  );
};

export default DashboardStaticClientWrapper;
