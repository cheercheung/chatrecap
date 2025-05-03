'use client';

import NotificationBlock from './index';

export default function NotificationBlockWrapper() {
  return (
    <NotificationBlock 
      promoCode="TRY" 
      hours={24} 
      onActionClick={() => {
        // 在这里可以添加导航逻辑，例如导航到分析页面
        window.location.href = '/chatrecapanalysis';
      }} 
    />
  );
}
