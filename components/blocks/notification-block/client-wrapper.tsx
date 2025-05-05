'use client';

import { lazy, Suspense } from 'react';

// 使用 lazy 延迟加载 NotificationBlock 组件
// 这样可以减少首屏加载时间
const NotificationBlock = lazy(() => import('./index'));

export default function NotificationBlockWrapper() {
  return (
    <Suspense fallback={null}>
      <NotificationBlock
        promoCode="TRY"
        hours={24}
        onActionClick={() => {
          // 使用 Next.js 的路由导航而不是直接修改 window.location
          // 这样可以避免整页刷新
          window.location.href = '/chatrecapanalysis';
        }}
      />
    </Suspense>
  );
}
