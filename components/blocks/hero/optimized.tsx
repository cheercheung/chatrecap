import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import OptimizedImage from "@/components/ui/optimized-image";

import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import Link from "next/link";
import { ChatNotification } from "@/components/ui/chat-notification";

// 优化的 Hero 组件，移除所有动画和效果
export default async function OptimizedHero({ hero }: { hero: HeroType }) {
  // 使用硬编码的聊天通知数据
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
                <div className="flex items-center mb-8">
                  <OptimizedImage
                    src="/imgs/badges/phdaily.svg"
                    alt="phdaily"
                    width={120}
                    height={40}
                    className="h-10"
                    priority={true}
                  />
                </div>
              )}
              <div className="text-left">
                {hero.announcement && (
                  <a
                    href={hero.announcement.url}
                    className="mb-5 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm"
                  >
                    {hero.announcement.label && (
                      <Badge className="bg-primary/80">{hero.announcement.label}</Badge>
                    )}
                    {hero.announcement.title}
                  </a>
                )}

                {texts && texts.length > 1 ? (
                  <h1 className="mb-5 mt-6 text-4xl font-bold lg:mb-8 lg:text-6xl max-w-3xl">
                    {texts[0]}
                    <span className="text-primary px-2">
                      {highlightText}
                    </span>
                    {texts[1]}
                  </h1>
                ) : (
                  <h1 className="mb-5 mt-6 text-4xl font-bold lg:mb-8 lg:text-6xl max-w-3xl">
                    {hero.title}
                  </h1>
                )}

                <p
                  className="text-muted-foreground lg:text-xl leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                />
                {hero.buttons && (
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
                            className="w-full"
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
                  </div>
                )}
                {hero.tip && (
                  <p className="mt-8 text-md text-muted-foreground font-medium">
                    {hero.tip}
                  </p>
                )}
                {hero.show_happy_users && (
                  <div className="mt-8">
                    <HappyUsers />
                  </div>
                )}
              </div>
            </div>

            {/* 右侧内容 - 聊天通知 */}
            <div className="flex items-start justify-center col-span-1">
              <div className="bg-card border border-primary/10 rounded-2xl w-full p-6 h-auto overflow-hidden">
                <h3 className="text-xl font-medium text-center mb-6 text-primary">{chatNotifications.title}</h3>

                {/* 直接显示聊天通知，不使用条件渲染和动画 */}
                <div className="space-y-4 pr-2 overflow-y-auto max-h-[400px] pb-2">
                  {/* 显示所有聊天通知 */}
                  <ChatNotification
                    speaker={chatNotifications.speakers.girlfriend}
                    time={chatNotifications.times.days_ago(2)}
                    content={chatNotifications.messages.message1}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.boyfriend}
                    time={chatNotifications.times.minutes_ago(10)}
                    content={chatNotifications.messages.message2}
                  />
                  <ChatNotification
                    speaker={chatNotifications.speakers.her}
                    time={chatNotifications.times.days_ago(1)}
                    content={chatNotifications.messages.message3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 移除装饰元素 */}
      </section>
    </>
  );
}
