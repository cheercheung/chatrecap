"use client";

import React from "react";
import { DashboardPageProps } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

// 导入静态翻译和工具函数
import dashboardTranslations from '@/i18n/en/dashboard.json';
import { createStaticTranslator } from '@/lib/static-translation-utils';

/**
 * 仪表盘概览静态组件
 *
 * 使用静态翻译而不是 useTranslations hook，避免国际化上下文问题
 */
const DashboardOverview: React.FC<DashboardPageProps> = ({
  credits,
  creditHistory,
  analysisHistory
}) => {
  // 使用静态翻译工具函数创建翻译器
  const t = createStaticTranslator(dashboardTranslations);

  // 只显示最近的3条分析记录
  const recentAnalysis = analysisHistory.slice(0, 3);

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* 积分部分 */}
      <div className="space-y-6">
        {/* 积分概览和购买按钮 */}
        <div className="flex flex-wrap gap-4 items-center">
          <Card className="flex-1 min-w-[200px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("credits.remaining")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{credits}</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/points">
            <Button variant="default">
              {t("credits.buy_button")}
            </Button>
          </Link>
        </div>
      </div>

      {/* 最近分析历史部分 */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("recent_history")}</h2>
          <Link href="/dashboard/history" className="text-primary text-sm hover:underline">
            {t("view_all")}
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("history.table.id")}</TableHead>
                  <TableHead>{t("history.table.platform")}</TableHead>
                  <TableHead>{t("history.table.date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAnalysis.length > 0 ? (
                  recentAnalysis.map((item, index) => (
                    <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/chatrecapresult?fileId=${item.id}`} className="text-primary hover:underline">
                          {item.id}
                        </Link>
                      </TableCell>
                      <TableCell>{item.platform}</TableCell>
                      <TableCell>{item.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">{t("history.no_records")}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
