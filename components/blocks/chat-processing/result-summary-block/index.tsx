"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ResultSummaryBlockProps } from "@/types/chat-processing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquare, Calendar, Users, Filter } from "lucide-react";


/**
 * 结果摘要组件
 *
 * 显示处理结果的摘要信息
 */
const ResultSummaryBlock: React.FC<ResultSummaryBlockProps> = ({
  result,
  className
}) => {
  // 使用翻译钩子，指定正确的命名空间
  const t = useTranslations("chat_analysis");

  // 计算日期范围
  const getDateRange = () => {
    const validDates = result.messages
      .map(m => m.date)
      .filter((d): d is Date => d !== undefined && !isNaN(d.getTime()));

    if (validDates.length < 2) {
      return t("results.unknown_date_range", { defaultValue: "Unknown date range" });
    }

    const sortedDates = [...validDates].sort((a, b) => a.getTime() - b.getTime());
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];

    return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  };

  // 获取参与者列表
  const getParticipants = () => {
    const senders = new Set(result.messages.map(m => m.sender));
    return Array.from(senders);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{t("results.summary_title", { defaultValue: "Chat Analysis Summary" })}</CardTitle>
        <CardDescription>{t("results.summary_description", { defaultValue: "Overview of your chat analysis results" })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 消息数量 */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">{t("results.total_messages", { defaultValue: "Total Messages" })}</p>
              <p className="text-2xl font-bold">{result.messages.length}</p>
              <p className="text-xs text-muted-foreground">
                {t("results.valid_date_messages", { count: result.stats.validDateMessages, defaultValue: `${result.stats.validDateMessages} messages with valid dates` })}
              </p>
            </div>
          </div>

          {/* 日期范围 */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">{t("results.date_range", { defaultValue: "Date Range" })}</p>
              <p className="text-lg font-bold">{getDateRange()}</p>
            </div>
          </div>

          {/* 参与者 */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">{t("results.participants", { defaultValue: "Participants" })}</p>
              <p className="text-lg font-bold">{getParticipants().length}</p>
              <p className="text-xs text-muted-foreground">
                {getParticipants().join(", ")}
              </p>
            </div>
          </div>

          {/* 过滤信息 */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Filter className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">{t("results.filtered_messages", { defaultValue: "Filtered Messages" })}</p>
              <p className="text-lg font-bold">
                {result.stats.filteredSystemMessages + result.stats.filteredMediaMessages}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("results.system_messages", { count: result.stats.filteredSystemMessages, defaultValue: `${result.stats.filteredSystemMessages} system messages` })}
                {" | "}
                {t("results.media_messages", { count: result.stats.filteredMediaMessages, defaultValue: `${result.stats.filteredMediaMessages} media messages` })}
              </p>
            </div>
          </div>
        </div>

        {/* 警告信息 */}
        {result.warnings.length > 0 && (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("results.warnings_title", { defaultValue: "Warnings" })}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultSummaryBlock;
