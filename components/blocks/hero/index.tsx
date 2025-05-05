"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";

import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatNotification } from "@/components/ui/chat-notification";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Hero({ hero }: { hero: HeroType }) {
  const [isClient, setIsClient] = useState(false);

  // 使用标准的翻译钩子
  // 使用how_it_works.chat_notifications命名空间
  const t = useTranslations('how_it_works.chat_notifications');

  // 使用 useEffect 确保组件只在客户端渲染后才显示完整内容
  useEffect(() => {
    setIsClient(true);
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
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center mb-8"
                >
                  <img
                    src="/imgs/badges/phdaily.svg"
                    alt="phdaily"
                    className="h-10 object-cover"
                  />
                </motion.div>
              )}
              <div className="text-left">
                {hero.announcement && (
                  <motion.a
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    href={hero.announcement.url}
                    className="mb-5 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm shadow-sm backdrop-blur-sm hover:bg-primary/10 transition-colors"
                  >
                    {hero.announcement.label && (
                      <Badge className="bg-primary/80 hover:bg-primary/90">{hero.announcement.label}</Badge>
                    )}
                    {hero.announcement.title}
                  </motion.a>
                )}

                {texts && texts.length > 1 ? (
                  <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isClient ? 1 : 0, y: isClient ? 0 : -10 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-5 mt-6 text-balance text-4xl font-bold lg:mb-8 lg:text-6xl max-w-3xl"
                  >
                    {texts[0]}
                    <span className="bg-gradient-to-r from-pink-500 via-primary to-pink-400 bg-clip-text text-transparent px-2">
                      {highlightText}
                    </span>
                    {texts[1]}
                  </motion.h1>
                ) : (
                  <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isClient ? 1 : 0, y: isClient ? 0 : -10 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-5 mt-6 text-balance text-4xl font-bold lg:mb-8 lg:text-6xl max-w-3xl"
                  >
                    {hero.title}
                  </motion.h1>
                )}

                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isClient ? 1 : 0, y: isClient ? 0 : -10 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-muted-foreground lg:text-xl leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                />
                {hero.buttons && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: isClient ? 1 : 0, y: isClient ? 0 : -10 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4"
                  >
                    {hero.buttons.map((item, i) => {
                      return (
                        <Link
                          key={i}
                          href={item.url || ""}
                          target={item.target || ""}
                          className="flex items-center"
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8 text-md text-muted-foreground font-medium"
                  >
                    {hero.tip}
                  </motion.p>
                )}
                {hero.show_happy_users && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8"
                  >
                    <HappyUsers />
                  </motion.div>
                )}
              </div>
            </div>

            {/* 右侧内容 - 聊天通知 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isClient ? 1 : 0, x: isClient ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-start justify-center col-span-1"
            >
              <div className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-2xl w-full p-6 shadow-lg h-auto overflow-hidden">
                <h3 className="text-xl font-medium text-center mb-6 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">{t('title')}</h3>
                <div className="space-y-4 pr-2 overflow-y-auto max-h-[400px] pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent" style={{ scrollBehavior: 'smooth' }}>
                  <ChatNotification
                    speaker={t('speakers.girlfriend')}
                    time={t('times.days_ago', { days: 2 })}
                    content={t('messages.message1')}
                    index={0}
                  />
                  <ChatNotification
                    speaker={t('speakers.boyfriend')}
                    time={t('times.minutes_ago', { minutes: 10 })}
                    content={t('messages.message2')}
                    index={1}
                  />
                  <ChatNotification
                    speaker={t('speakers.her')}
                    time={t('times.days_ago', { days: 1 })}
                    content={t('messages.message3')}
                    index={2}
                  />
                  <ChatNotification
                    speaker={t('speakers.him')}
                    time={t('times.minutes_ago', { minutes: 30 })}
                    content={t('messages.message4')}
                    index={3}
                  />
                  <ChatNotification
                    speaker={t('speakers.ex')}
                    time={t('times.days_ago', { days: 3 })}
                    content={t('messages.message5')}
                    index={4}
                  />
                  <ChatNotification
                    speaker={t('speakers.friend')}
                    time={t('times.hours_ago', { hours: 5 })}
                    content={t('messages.message6')}
                    index={5}
                  />
                  <ChatNotification
                    speaker={t('speakers.crush')}
                    time={t('times.just_now')}
                    content={t('messages.message7')}
                    index={6}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>
    </>
  );
}
