"use client";

import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";

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
  // 使用 ref 和 useInView 来检测元素是否在视口中
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isVisible, setIsVisible] = useState(false);

  // 当元素进入视口时，设置为可见
  useEffect(() => {
    if (isInView) {
      // 添加一个小延迟，使元素按顺序显示
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, index * 100);

      return () => clearTimeout(timeout);
    }
  }, [isInView, index]);

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10 shadow-sm hover:shadow-md transition-all cursor-pointer",
        className
      )}
    >
      <Avatar className="h-10 w-10 transition-transform duration-300 group-hover:scale-110">
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
          <h4 className="font-medium text-sm transition-colors duration-300 group-hover:text-primary">{speaker}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-foreground/90 break-words">{content}</p>
      </div>

      {/* 悬停时的背景效果 */}
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/[.03] group-hover:dark:bg-primary/[.05] rounded-lg" />
    </motion.div>
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
          index={index}
        />
      ))}
    </div>
  );
}
