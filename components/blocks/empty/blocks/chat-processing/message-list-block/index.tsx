"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageListBlockProps } from "@/types/chat-processing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 消息列表组件
 *
 * 显示处理后的消息列表
 */
const MessageListBlock: React.FC<MessageListBlockProps> = ({
  messages,
  className
}) => {
  const t = useTranslations("chat_analysis");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 20;

  // 过滤消息
  const filteredMessages = searchTerm
    ? messages.filter(
        message =>
          message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.sender.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  // 计算总页数
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // 获取当前页的消息
  const currentMessages = filteredMessages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 重置到第一页
  };

  // 处理页面变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 格式化日期
  const formatDate = (date?: Date) => {
    if (!date || isNaN(date.getTime())) {
      return "Unknown date";
    }

    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{t("results.messages_title")}</CardTitle>
        <CardDescription>
          {t("results.messages_description", { count: messages.length })}
        </CardDescription>

        {/* 搜索表单 */}
        <form onSubmit={handleSearch} className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder={t("results.search_placeholder")}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            {t("results.search")}
          </Button>
        </form>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 消息列表 */}
        <div className="space-y-3">
          {currentMessages.length > 0 ? (
            currentMessages.map((message, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-primary">
                    {message.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.date)}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm
                ? t("results.no_search_results")
                : t("results.no_messages")}
            </p>
          )}
        </div>

        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("results.previous")}
            </Button>

            <span className="text-sm text-muted-foreground">
              {t("results.page_info", {
                current: currentPage,
                total: totalPages
              })}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t("results.next")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageListBlock;
