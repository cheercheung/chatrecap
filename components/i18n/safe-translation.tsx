'use client';

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { keyMapping } from '@/i18n/key-mapping';

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
  // 应用键映射
  const mappedKeyPath = keyMapping[keyPath] || keyPath;

  // 如果使用了映射键，记录日志（仅在开发环境）
  if (process.env.NODE_ENV === 'development' && keyPath !== mappedKeyPath) {
    console.warn(`Using mapped key: ${keyPath} -> ${mappedKeyPath}`);
  }

  // 尝试直接翻译完整的键
  try {
    const t = useTranslations();
    const text = t(mappedKeyPath, params);
    return children ? children(text) : <>{text}</>;
  } catch (error) {
    // 如果直接翻译失败，尝试使用回退命名空间
    for (const namespace of fallbackNamespaces) {
      try {
        const t = useTranslations(namespace);
        const text = t(mappedKeyPath, params);
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
 *
 * 或者使用默认值对象:
 * const t = useSafeTranslation(['footer', 'components.footer'], {
 *   copyright: "© 2025 ChatRecap AI. All rights reserved."
 * });
 */
export function useSafeTranslation(fallbackNamespaces: string[] = [], defaultValues: Record<string, string> = {}) {
  return (key: string, defaultValueOrParams?: string | Record<string, any>, params?: Record<string, any>) => {
    // 应用键映射
    const mappedKey = keyMapping[key] || key;

    // 如果使用了映射键，记录日志（仅在开发环境）
    if (process.env.NODE_ENV === 'development' && key !== mappedKey) {
      console.warn(`Using mapped key: ${key} -> ${mappedKey}`);
    }

    // 处理参数
    let defaultValue = '';
    let translationParams = {};

    if (typeof defaultValueOrParams === 'string') {
      defaultValue = defaultValueOrParams;
      translationParams = params || {};
    } else if (defaultValueOrParams && typeof defaultValueOrParams === 'object') {
      translationParams = defaultValueOrParams;
    }

    try {
      // 尝试直接翻译
      const t = useTranslations();
      return t(mappedKey, translationParams);
    } catch (error) {
      // 尝试使用回退命名空间
      for (const namespace of fallbackNamespaces) {
        try {
          const t = useTranslations(namespace);
          return t(mappedKey, translationParams);
        } catch (innerError) {
          // 继续尝试下一个命名空间
        }
      }

      // 如果所有尝试都失败，返回默认值
      // 首先检查默认值对象
      if (defaultValues[key]) {
        return defaultValues[key];
      }
      // 然后检查直接提供的默认值
      return defaultValue || key;
    }
  };
}
