/**
 * i18n修复助手
 * 
 * 这个脚本帮助您：
 * 1. 生成通用的i18n安全访问组件
 * 2. 修复特定的notification和chat_notifications问题
 */

const fs = require('fs');
const path = require('path');

// 创建安全翻译组件
const createSafeTranslationComponent = () => {
  const componentContent = `'use client';

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

interface SafeTranslationProps {
  keyPath: string;
  fallbackNamespaces?: string[];
  defaultValue?: string;
  params?: Record<string, any>;
  children?: (text: string) => ReactNode;
}

/**
 * 安全的翻译组件，尝试多个命名空间路径
 * 
 * 使用示例:
 * <SafeTranslation 
 *   keyPath="limited_time_offer" 
 *   fallbackNamespaces={['notification', 'components.notification', 'chat_notifications.notification']} 
 *   defaultValue="Limited Time Offer!"
 * />
 */
export default function SafeTranslation({
  keyPath,
  fallbackNamespaces = [],
  defaultValue = '',
  params = {},
  children
}: SafeTranslationProps) {
  // 尝试直接翻译完整的键
  try {
    const t = useTranslations();
    const text = t(keyPath, params);
    return children ? children(text) : <>{text}</>;
  } catch (error) {
    // 如果直接翻译失败，尝试使用回退命名空间
    for (const namespace of fallbackNamespaces) {
      try {
        const t = useTranslations(namespace);
        const text = t(keyPath, params);
        return children ? children(text) : <>{text}</>;
      } catch (innerError) {
        // 继续尝试下一个命名空间
      }
    }
    
    // 如果所有尝试都失败，返回默认值
    return <>{defaultValue || keyPath}</>;
  }
}

/**
 * 安全的翻译钩子，尝试多个命名空间路径
 * 
 * 使用示例:
 * const t = useSafeTranslation(['notification', 'components.notification']);
 * const text = t('limited_time_offer', 'Default Value');
 */
export function useSafeTranslation(fallbackNamespaces: string[] = []) {
  return (key: string, defaultValue: string = '', params: Record<string, any> = {}) => {
    try {
      // 尝试直接翻译
      const t = useTranslations();
      return t(key, params);
    } catch (error) {
      // 尝试使用回退命名空间
      for (const namespace of fallbackNamespaces) {
        try {
          const t = useTranslations(namespace);
          return t(key, params);
        } catch (innerError) {
          // 继续尝试下一个命名空间
        }
      }
      
      // 如果所有尝试都失败，返回默认值
      return defaultValue || key;
    }
  };
}
`;

  // 保存组件文件
  const componentPath = path.join('components', 'i18n', 'safe-translation.tsx');
  
  // 确保目录存在
  const dir = path.dirname(componentPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(componentPath, componentContent);
  console.log(`已创建安全翻译组件: ${componentPath}`);
  
  return componentPath;
};

// 创建通知组件修复示例
const createNotificationFixExample = () => {
  const exampleContent = `'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBlockProps } from './types';
import { useSafeTranslation } from '@/components/i18n/safe-translation';

export default function NotificationBlock({
  promoCode = "TRY",
  hours = 24,
  onActionClick,
  className
}: NotificationBlockProps) {
  const [isVisible, setIsVisible] = useState(true);

  // 使用安全翻译钩子，尝试多个命名空间
  const t = useSafeTranslation([
    'notification', 
    'components.notification', 
    'chat_notifications.notification'
  ]);

  // 定义默认值，以防翻译键不存在
  const defaultValues: Record<string, string> = {
    "limited_time_offer": "Limited Time Offer!",
    "use_code": "Use code",
    "to_unlock": "to unlock",
    "hours": "hours",
    "of_full_access": "of full access — absolutely",
    "free": "FREE!",
    "hurry": "Hurry, this code expires in",
    "try_now": "Try Now"
  };

  if (!isVisible) return null;

  return (
    <div className={\`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col items-center justify-center text-center \${className}\`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div className="mb-2 text-xl font-bold text-pink-500">
        🎉 {t('limited_time_offer', defaultValues.limited_time_offer)}
      </div>

      <div className="mb-4">
        <span className="font-medium">{t('use_code', defaultValues.use_code)}</span>{' '}
        <span className="font-bold text-primary">{promoCode}</span>{' '}
        <span className="font-medium">{t('to_unlock', defaultValues.to_unlock)}</span>{' '}
        <span className="font-bold">24</span>{' '}
        <span className="font-medium">{t('hours', defaultValues.hours)}</span>{' '}
        <span className="font-medium">{t('of_full_access', defaultValues.of_full_access)}</span>{' '}
        <span className="font-bold text-green-500">{t('free', defaultValues.free)}</span>
      </div>

      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {t('hurry', defaultValues.hurry)} <span className="font-bold">12:00:00</span>
      </div>

      <Button
        onClick={onActionClick}
        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
      >
        {t('try_now', defaultValues.try_now)}
      </Button>
    </div>
  );
}
`;

  // 保存示例文件
  const examplePath = 'examples/notification-block-fixed.tsx';
  
  // 确保目录存在
  const dir = path.dirname(examplePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(examplePath, exampleContent);
  console.log(`已创建通知组件修复示例: ${examplePath}`);
  
  return examplePath;
};

// 创建聊天通知组件修复示例
const createChatNotificationFixExample = () => {
  const exampleContent = `'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatNotification } from '@/components/ui/chat-notification';
import { useSafeTranslation } from '@/components/i18n/safe-translation';

export default function Hero({ hero }) {
  const [isClient, setIsClient] = useState(false);

  // 使用安全翻译钩子，尝试多个命名空间
  const t = useSafeTranslation([
    'chat_notifications',
    'how_it_works.chat_notifications'
  ]);

  // 定义默认值，以防翻译键不存在
  const defaultValues = {
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
      days_ago: "{days} days ago",
      hours_ago: "{hours} hours ago",
      minutes_ago: "{minutes} minutes ago",
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isClient ? 1 : 0, x: isClient ? 0 : 20 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex items-start justify-center col-span-1"
    >
      <div className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-2xl w-full p-6 shadow-lg h-auto overflow-hidden">
        <h3 className="text-xl font-medium text-center mb-6 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
          {t('title', defaultValues.title)}
        </h3>
        <div className="space-y-4 pr-2 overflow-y-auto max-h-[400px] pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent" style={{ scrollBehavior: 'smooth' }}>
          <ChatNotification
            speaker={t('speakers.girlfriend', defaultValues.speakers.girlfriend)}
            time={t('times.days_ago', { days: 2 }, defaultValues.times.days_ago.replace('{days}', '2'))}
            content={t('messages.message1', defaultValues.messages.message1)}
            index={0}
          />
          <ChatNotification
            speaker={t('speakers.boyfriend', defaultValues.speakers.boyfriend)}
            time={t('times.minutes_ago', { minutes: 10 }, defaultValues.times.minutes_ago.replace('{minutes}', '10'))}
            content={t('messages.message2', defaultValues.messages.message2)}
            index={1}
          />
          <ChatNotification
            speaker={t('speakers.her', defaultValues.speakers.her)}
            time={t('times.days_ago', { days: 1 }, defaultValues.times.days_ago.replace('{days}', '1'))}
            content={t('messages.message3', defaultValues.messages.message3)}
            index={2}
          />
          <ChatNotification
            speaker={t('speakers.him', defaultValues.speakers.him)}
            time={t('times.minutes_ago', { minutes: 30 }, defaultValues.times.minutes_ago.replace('{minutes}', '30'))}
            content={t('messages.message4', defaultValues.messages.message4)}
            index={3}
          />
          <ChatNotification
            speaker={t('speakers.ex', defaultValues.speakers.ex)}
            time={t('times.days_ago', { days: 3 }, defaultValues.times.days_ago.replace('{days}', '3'))}
            content={t('messages.message5', defaultValues.messages.message5)}
            index={4}
          />
          <ChatNotification
            speaker={t('speakers.friend', defaultValues.speakers.friend)}
            time={t('times.hours_ago', { hours: 5 }, defaultValues.times.hours_ago.replace('{hours}', '5'))}
            content={t('messages.message6', defaultValues.messages.message6)}
            index={5}
          />
          <ChatNotification
            speaker={t('speakers.crush', defaultValues.speakers.crush)}
            time={t('times.just_now', defaultValues.times.just_now)}
            content={t('messages.message7', defaultValues.messages.message7)}
            index={6}
          />
        </div>
      </div>
    </motion.div>
  );
}
`;

  // 保存示例文件
  const examplePath = 'examples/chat-notification-fixed.tsx';
  
  // 确保目录存在
  const dir = path.dirname(examplePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(examplePath, exampleContent);
  console.log(`已创建聊天通知组件修复示例: ${examplePath}`);
  
  return examplePath;
};

// 创建修复指南
const createFixGuide = (componentPath, notificationExamplePath, chatNotificationExamplePath) => {
  const guideContent = `# i18n键名不匹配问题修复指南

## 问题描述

您的应用程序中存在i18n键名不匹配的问题，特别是与\`notification\`、\`chat_notifications\`和\`components.footer\`等键相关的问题。这导致了翻译缺失和错误。

## 解决方案

我们提供了以下解决方案：

1. 安全翻译组件：\`${componentPath}\`
   - 这个组件可以尝试多个命名空间路径，确保即使键名不匹配也能找到正确的翻译。

2. 通知组件修复示例：\`${notificationExamplePath}\`
   - 这个示例展示了如何修复通知组件中的键名不匹配问题。

3. 聊天通知组件修复示例：\`${chatNotificationExamplePath}\`
   - 这个示例展示了如何修复聊天通知组件中的键名不匹配问题。

## 使用方法

### 安全翻译组件

\`\`\`jsx
import { SafeTranslation, useSafeTranslation } from '@/components/i18n/safe-translation';

// 作为组件使用
<SafeTranslation 
  keyPath="limited_time_offer" 
  fallbackNamespaces={['notification', 'components.notification', 'chat_notifications.notification']} 
  defaultValue="Limited Time Offer!"
/>

// 作为钩子使用
const t = useSafeTranslation(['notification', 'components.notification']);
const text = t('limited_time_offer', 'Default Value');
\`\`\`

### 修复通知组件

1. 打开您的通知组件文件
2. 参考 \`${notificationExamplePath}\` 中的示例
3. 使用 \`useSafeTranslation\` 钩子替换现有的翻译逻辑

### 修复聊天通知组件

1. 打开您的聊天通知组件文件
2. 参考 \`${chatNotificationExamplePath}\` 中的示例
3. 使用 \`useSafeTranslation\` 钩子替换现有的翻译逻辑

## 长期解决方案

为了从根本上解决键名不匹配的问题，建议：

1. 运行 \`node scripts/i18n-key-detector.js\` 检测所有不匹配的键
2. 统一键名命名规则，避免重复和冲突
3. 在翻译文件中添加缺失的键
4. 使用 \`SafeTranslation\` 组件作为安全保障

## 关于favicon-16x16.png错误

这个错误可能是由于中间件或路由配置问题导致的。请检查：

1. \`middleware.ts\` 文件中的路由匹配规则
2. \`next.config.js\` 中的静态资源处理配置
3. 确保favicon文件在正确的位置

`;

  // 保存指南文件
  const guidePath = 'i18n-fix-guide.md';
  fs.writeFileSync(guidePath, guideContent);
  console.log(`已创建修复指南: ${guidePath}`);
  
  return guidePath;
};

// 主函数
function main() {
  console.log('开始创建i18n修复助手...');
  
  // 创建安全翻译组件
  const componentPath = createSafeTranslationComponent();
  
  // 创建通知组件修复示例
  const notificationExamplePath = createNotificationFixExample();
  
  // 创建聊天通知组件修复示例
  const chatNotificationExamplePath = createChatNotificationFixExample();
  
  // 创建修复指南
  const guidePath = createFixGuide(componentPath, notificationExamplePath, chatNotificationExamplePath);
  
  console.log('\n修复助手创建完成！');
  console.log(`请查看修复指南: ${guidePath}`);
}

// 运行主函数
main();
