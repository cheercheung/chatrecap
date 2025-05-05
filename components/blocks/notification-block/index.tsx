'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBlockProps } from './types';

export default function NotificationBlock({
  promoCode = "TRY",
  hours = 24,
  onActionClick,
  className
}: NotificationBlockProps) {
  const [isVisible, setIsVisible] = useState(true);

  // 使用标准的翻译钩子
  // 使用notification命名空间
  const t = useTranslations('notification');

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col items-center justify-center text-center ${className}`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div className="mb-2 text-xl font-bold text-pink-500">
        🎉 {t('limited_time_offer')}
      </div>

      <div className="mb-2">
        {t('use_code')} <span className="font-bold text-purple-800 dark:text-purple-400">{promoCode}</span> {' '}
        {t('to_unlock')} <span className="font-bold">{hours} {t('hours')}</span> {' '}
        {t('of_full_access')} <span className="font-bold text-gray-700 dark:text-gray-300">{t('free')}</span>
      </div>

      <div className="mb-4">
        ⏳ {t('hurry')} {hours} {t('hours')}!
      </div>

      <Button
        onClick={() => {
          if (onActionClick) onActionClick();
        }}
        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full"
      >
        {t('try_now')}
      </Button>
    </div>
  );
}
