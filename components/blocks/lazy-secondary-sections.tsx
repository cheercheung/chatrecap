/**
 * 静态版本的 LazySecondarySections 组件
 * 使用静态组件以支持 SSG
 */
import { LandingPage } from '@/types/pages/landing';
import StaticLandingSections from '@/components/blocks/static-landing-sections';
// 导入静态翻译
import { landingTranslations } from '@/lib/static-translations';

export default function LazySecondarySections({ page }: { page: LandingPage }) {
  return <StaticLandingSections page={page} />;
}