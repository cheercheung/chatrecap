'use client';

import SimplePricing from './index';
import { SimplePricing as SimplePricingType } from '@/types/blocks/simple-pricing';

interface SimplePricingClientWrapperProps {
  data: SimplePricingType;
  messages: Record<string, any>;
}

/**
 * Client wrapper for the SimplePricing component
 *
 * This is a simplified wrapper that directly passes props to the SimplePricing component
 * without using NextIntlClientProvider to avoid internationalization context issues.
 */
export default function SimplePricingClientWrapper({
  data,
  messages
}: SimplePricingClientWrapperProps) {
  return <SimplePricing {...data} />;
}
