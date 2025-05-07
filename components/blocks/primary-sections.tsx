'use client';

import Header from '@/components/blocks/header';
import Hero from '@/components/blocks/hero';
import PlatformUploadWrapper from '@/components/blocks/platform-upload/client-wrapper';
import { LandingPage } from '@/types/pages/landing';

interface PrimarySectionsProps {
  header?: LandingPage['header'];
  hero?: LandingPage['hero'];
  platform_upload?: LandingPage['platform_upload'];
  upload_box?: LandingPage['upload_box'];
}

export default function PrimarySections({ header, hero, platform_upload, upload_box }: PrimarySectionsProps) {
  return (
    <>
      {/* 全局导航 */}
      {header && <Header header={header} />}
      {/* Hero 区块 */}
      {hero && <Hero hero={hero} />}
      {/* 上传区块，仅客户端渲染 */}
      {platform_upload && upload_box && (
        <PlatformUploadWrapper section={platform_upload} upload_box={upload_box} />
      )}
    </>
  );
}