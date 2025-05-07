'use client';

import { LandingPage } from '@/types/pages/landing';
import LandingSections from '@/components/blocks/landing-sections';

export default function LazySecondarySections({ page }: { page: LandingPage }) {
  return <LandingSections page={page} />;
}