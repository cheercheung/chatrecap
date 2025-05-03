'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface IntlProviderProps {
  locale: string;
  messages: Record<string, any>;
  children: ReactNode;
}

export default function IntlProvider({ locale, messages, children }: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        // 当缺少翻译时，不抛出错误，而是回退到默认语言
        if (error.code === 'MISSING_MESSAGE') {
          console.warn(`Missing translation: ${error.originalMessage}`);
          return undefined;
        }
        // 对于其他错误，仍然抛出
        throw error;
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
