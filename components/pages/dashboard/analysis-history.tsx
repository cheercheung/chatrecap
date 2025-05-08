"use client";

import React from "react";
import { AnalysisHistoryItem } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface AnalysisHistoryProps {
  analysisHistory: AnalysisHistoryItem[];
}

/**
 * 分析历史组件
 * 
 * 显示用户分析历史记录
 */
const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analysisHistory }) => {
  const t = useTranslations("dashboard");

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">{t("history.title")}</h1>
        <p className="text-muted-foreground">{t("history.description")}</p>
      </div>

      {/* 分析历史表格 */}
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
              {analysisHistory.length > 0 ? (
                analysisHistory.map((item, index) => (
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
  );
};

export default AnalysisHistory;
