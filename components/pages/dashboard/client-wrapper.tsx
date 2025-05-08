"use client";

import React, { useState } from "react";
import { DashboardPageProps } from "@/types/dashboard";
import DashboardOverview from "./overview";
import PointsHistory from "./points-history";
import AnalysisHistory from "./analysis-history";
import { Sidebar } from "@/types/blocks/sidebar";
import DashboardClientLayout from "@/components/dashboard/client-layout";
import { useTranslations } from "next-intl";

type DashboardView = "overview" | "points" | "history";

interface DashboardClientWrapperProps {
  data: DashboardPageProps;
}

/**
 * 仪表盘客户端包装组件
 *
 * 处理侧边栏导航和视图切换
 */
const DashboardClientWrapper: React.FC<DashboardClientWrapperProps> = ({ data }) => {
  const t = useTranslations("dashboard");
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

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

export default DashboardClientWrapper;
