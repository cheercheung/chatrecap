"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import OptimizedImage from "@/components/ui/optimized-image";

import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatNotification } from "@/components/ui/chat-notification";

import { useState, useEffect, useMemo } from "react";
import { createAnimation } from "@/lib/animation";
import { useTranslations } from "next-intl";

// 优化的 Hero 组件，使用 OptimizedImage 和延迟加载
export default function OptimizedHero({ hero }: { hero: HeroType }) {
  // 使用正确的翻译命名空间
  const t = useTranslations("chat_notifications");
  const [isClient, setIsClient] = useState(false);
  const [showChatNotifications, setShowChatNotifications] = useState(false);

  // 使用 useEffect 确保组件只在客户端渲染后才显示完整内容
  useEffect(() => {
    // 使用 requestAnimationFrame 确保在下一帧渲染时设置 isClient
    // 这样可以避免在首次渲染时触发不必要的动画
    requestAnimationFrame(() => {
      setIsClient(true);
    });

    // 延迟加载聊天通知，提高首屏加载速度
    // 增加延迟时间，确保首屏内容优先渲染
    const timer = setTimeout(() => {
      setShowChatNotifications(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      <section className="py-32 relative">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            {/* 左侧内容 */}
            <div className="flex flex-col col-span-2">
              {hero.show_badge && (
                <motion.div
                  {...createAnimation(0, 0.5, 'fadeInDown')}
                  className="flex items-center mb-8"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <OptimizedImage
                    src="/imgs/badges/phdaily.svg"
                    alt="phdaily"
                    width={120}
                    height={40}
                    className="h-10"
                    priority={true}
                  />
                </motion.div>
              )}
              <div className="text-left">
                {hero.announcement && (
                  <motion.a
                    {...createAnimation(0.1, 0.5, 'fadeInUp')}
                    href={hero.announcement.url}
                    className="mb-5 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm shadow-sm backdrop-blur-sm hover:bg-primary/10 transition-colors"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {hero.announcement.label && (
                      <Badge className="bg-primary/80 hover:bg-primary/90">{hero.announcement.label}</Badge>
                    )}
                    {hero.announcement.title}
                  </motion.a>
                )}

                {texts && texts.length > 1 ? (
                  <motion.h1
                    {...createAnimation(0.1, 0.6, 'fadeInUp')}
                    animate={{
                      opacity: isClient ? 1 : 0,
                      transform: isClient ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                    className="mb-5 mt-6 text-balance text-4xl font-bold lg:mb-8 lg:text-6xl max-w-3xl"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {texts[0]}
                    <span className="bg-gradient-to-r from-pink-500 via-primary to-pink-400 bg-clip-text text-transparent px-2">
                      {highlightText}
                    </span>
                    {texts[1]}
                  </motion.h1>
                ) : (
                  <motion.h1
                    {...createAnimation(0.1, 0.6, 'fadeInUp')}
                    animate={{
                      opacity: isClient ? 1 : 0,
                      transform: isClient ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                    className="mb-5 mt-6 text-balance text-4xl font-bold lg:mb-8 lg:text-6xl max-w-3xl"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {hero.title}
                  </motion.h1>
                )}

                <motion.p
                  {...createAnimation(0.2, 0.6, 'fadeInUp')}
                  animate={{
                    opacity: isClient ? 1 : 0,
                    transform: isClient ? 'translateY(0)' : 'translateY(-10px)'
                  }}
                  className="text-muted-foreground lg:text-xl leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                  style={{ willChange: 'transform, opacity' }}
                />
                {hero.buttons && (
                  <motion.div
                    {...createAnimation(0.3, 0.6, 'fadeInUp')}
                    animate={{
                      opacity: isClient ? 1 : 0,
                      transform: isClient ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                    className="mt-10 flex flex-col sm:flex-row gap-4"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {hero.buttons.map((item, i) => {
                      return (
                        <Link
                          key={i}
                          href={item.url || ""}
                          target={item.target || ""}
                          className="flex items-center"
                          prefetch={false} // 禁用预取，减少不必要的网络请求
                        >
                          <Button
                            className={`w-full shadow-md hover:shadow-lg transition-all ${
                              item.variant === "default" ? "bg-gradient-to-r from-primary to-pink-500 hover:from-primary hover:to-pink-600" : ""
                            }`}
                            size="lg"
                            variant={item.variant || "default"}
                          >
                            {item.title}
                            {item.icon && (
                              <Icon name={item.icon} className="ml-2" />
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
                {hero.tip && (
                  <motion.p
                    {...createAnimation(0.5, 0.6, 'fadeInUp')}
                    className="mt-8 text-md text-muted-foreground font-medium"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {hero.tip}
                  </motion.p>
                )}
                {hero.show_happy_users && (
                  <motion.div
                    {...createAnimation(0.6, 0.6, 'fadeInUp')}
                    className="mt-8"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <HappyUsers />
                  </motion.div>
                )}
              </div>
            </div>

            {/* 右侧内容 - 聊天通知 */}
            <div className="flex items-start justify-center col-span-1">
              <div className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-2xl w-full p-6 shadow-lg h-auto overflow-hidden">
                <h3 className="text-xl font-medium text-center mb-6 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">{t("title")}</h3>

                {/* 只有在客户端渲染后且延迟加载计时器触发后才显示聊天通知 */}
                {isClient && showChatNotifications ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pr-2 overflow-y-auto max-h-[400px] pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
                  >
                    {/* 减少初始显示的聊天通知数量，提高渲染性能 */}
                    <ChatNotification
                      speaker={t("speakers.girlfriend")}
                      time={t("times.days_ago", { days: 2 })}
                      content={t("messages.message1")}
                      index={0}
                    />
                    <ChatNotification
                      speaker={t("speakers.boyfriend")}
                      time={t("times.minutes_ago", { minutes: 10 })}
                      content={t("messages.message2")}
                      index={1}
                    />
                    <ChatNotification
                      speaker={t("speakers.her")}
                      time={t("times.days_ago", { days: 1 })}
                      content={t("messages.message3")}
                      index={2}
                    />
                    {/* 其余的聊天通知在用户滚动时才会显示 */}
                    {isClient && (
                      <>
                        <ChatNotification
                          speaker={t("speakers.him")}
                          time={t("times.minutes_ago", { minutes: 30 })}
                          content={t("messages.message4")}
                          index={3}
                        />
                        <ChatNotification
                          speaker={t("speakers.ex")}
                          time={t("times.days_ago", { days: 3 })}
                          content={t("messages.message5")}
                          index={4}
                        />
                        <ChatNotification
                          speaker={t("speakers.friend")}
                          time={t("times.hours_ago", { hours: 5 })}
                          content={t("messages.message6")}
                          index={5}
                        />
                        <ChatNotification
                          speaker={t("speakers.crush")}
                          time={t("times.just_now")}
                          content={t("messages.message7")}
                          index={6}
                        />
                      </>
                    )}
                  </motion.div>
                ) : (
                  // 加载占位符 - 减少占位符数量，提高渲染性能
                  <div className="space-y-4 pr-2 max-h-[400px] pb-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="h-6 bg-muted/50 rounded-md w-1/3 animate-pulse"></div>
                        <div className="h-12 bg-muted/30 rounded-md w-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>
    </>
  );
}
