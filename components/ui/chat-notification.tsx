"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatNotificationProps {
  speaker: string;
  time: string;
  content: string;
  avatarUrl?: string;
  className?: string;
  index?: number;
}

export function ChatNotification({
  speaker,
  time,
  content,
  avatarUrl,
  className,
  index = 0,
}: ChatNotificationProps) {
  // 移除所有动画和视口检测逻辑，直接显示内容

  // 根据speaker生成头像的颜色和首字母
  const getAvatarInfo = (name: string) => {
    const colors = [
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
    ];

    const colorIndex = name.length % colors.length;
    const initials = name.substring(0, 2).toUpperCase();

    return {
      color: colors[colorIndex],
      initials,
    };
  };

  const { color, initials } = getAvatarInfo(speaker);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-primary/10",
        className
      )}
    >
      <Avatar className="h-10 w-10">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={speaker} />
        ) : (
          <AvatarFallback className={`${color} text-white`}>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-sm">{speaker}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-foreground/90 break-words">{content}</p>
      </div>
    </div>
  );
}

interface ChatNotificationsListProps {
  notifications: ChatNotificationProps[];
  className?: string;
}

export function ChatNotificationsList({
  notifications,
  className,
}: ChatNotificationsListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {notifications.map((notification, index) => (
        <ChatNotification
          key={index}
          {...notification}
        />
      ))}
    </div>
  );
}
