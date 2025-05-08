"use client";

import React from "react";
import { CreditHistoryItem } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface PointsHistoryProps {
  creditHistory: CreditHistoryItem[];
}

/**
 * 积分历史组件
 * 
 * 显示用户积分历史记录
 */
const PointsHistory: React.FC<PointsHistoryProps> = ({ creditHistory }) => {
  const t = useTranslations("dashboard");

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
                    <TableCell>{t(`credits.types.${item.type}`)}</TableCell>
                    <TableCell className={item.amount > 0 ? "text-green-600" : "text-red-600"}>
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
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
