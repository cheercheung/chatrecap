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

export default function Hero({ hero }: { hero: HeroType }) {
  const [isClient, setIsClient] = useState(false);

  // 使用 hero 对象中的数据
  const chatNotifications = {
    title: "Chat Notifications",
    speakers: {
      girlfriend: "Girlfriend",
      boyfriend: "Boyfriend",
      her: "Her",
      him: "Him",
      ex: "Ex",
      friend: "Friend",
      crush: "Crush"
    },
    times: {
      days_ago: (days: number) => `${days} days ago`,
      minutes_ago: (minutes: number) => `${minutes} minutes ago`,
      hours_ago: (hours: number) => `${hours} hours ago`,
      just_now: "Just now"
    },
    messages: {
      message1: "Oh, you finally texted? Must've broken a world record 🏆🙄",
      message2: "Sorry, my phone only buzzes for pizza deliveries 🍕📳",
      message3: "Your pick-up lines are faster than my microwave popcorn 🍿💨",
      message4: "Our chat's colder than Antarctica ❄️😎",
      message5: "Miss me? I barely remember your name 😂",
      message6: "Your dating life is like my WiFi - unstable connection 📶",
      message7: "Seen your message. Will reply in 2-3 business days 📅"
    }
  };

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
                <h3 className="text-xl font-medium text-center mb-6 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">{chatNotifications.title}</h3>
                <div className="space-y-4 pr-2 overflow-y-auto max-h-[400px] pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent" style={{ scrollBehavior: 'smooth' }}>
                  <ChatNotification
                    speaker={chatNotifications.speakers.girlfriend}
                    time={chatNotifications.times.days_ago(2)}
                    content={chatNotifications.messages.message1}
                    index={0}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.boyfriend}
                    time={chatNotifications.times.minutes_ago(10)}
                    content={chatNotifications.messages.message2}
                    index={1}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.her}
                    time={chatNotifications.times.days_ago(1)}
                    content={chatNotifications.messages.message3}
                    index={2}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.him}
                    time={chatNotifications.times.minutes_ago(30)}
                    content={chatNotifications.messages.message4}
                    index={3}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.ex}
                    time={chatNotifications.times.days_ago(3)}
                    content={chatNotifications.messages.message5}
                    index={4}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.friend}
                    time={chatNotifications.times.hours_ago(5)}
                    content={chatNotifications.messages.message6}
                    index={5}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.crush}
                    time={chatNotifications.times.just_now}
                    content={chatNotifications.messages.message7}
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
