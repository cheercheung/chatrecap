"use client";

import React from "react";
import { CreditHistoryItem } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 导入静态翻译和工具函数
import dashboardTranslations from '@/i18n/en/dashboard.json';
import { createStaticTranslator } from '@/lib/static-translation-utils';

/**
 * 积分历史静态组件
 *
 * 使用静态翻译而不是 useTranslations hook，避免国际化上下文问题
 */
const PointsHistory: React.FC<{ creditHistory: CreditHistoryItem[] }> = ({
  creditHistory
}) => {
  // 使用静态翻译工具函数创建翻译器
  const t = createStaticTranslator(dashboardTranslations);

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">{t("credits.history")}</h1>
        <p className="text-muted-foreground">{t("credits.history_description")}</p>
      </div>

      {/* 积分历史表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("credits.table.type")}</TableHead>
                <TableHead>{t("credits.table.amount")}</TableHead>
                <TableHead>{t("credits.table.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditHistory.length > 0 ? (
                creditHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.type === 'purchase' ? t("credits.types.purchase") : t("credits.types.used")}
                    </TableCell>
                    <TableCell className={item.type === 'purchase' ? 'text-green-600' : 'text-red-600'}>
                      {item.type === 'purchase' ? '+' : ''}{item.amount}
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">{t("credits.no_records")}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsHistory;
