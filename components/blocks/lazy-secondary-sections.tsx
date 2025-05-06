'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { LandingPage } from '@/types/pages/landing';
import { Suspense } from 'react';

// 动态导入次屏组件（重用 LandingSections）
const Secondary = dynamic< { page: LandingPage } >(
  () => import('@/components/blocks/landing-sections'),
  { ssr: false }
);

export default function LazySecondarySections({ page }: { page: LandingPage }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShow(true);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={ref} />
      {show && (
        <Suspense fallback={<div className="py-16 bg-muted/30 animate-pulse"></div>}>
          <Secondary page={page} />
        </Suspense>
      )}
    </>
  );
} 