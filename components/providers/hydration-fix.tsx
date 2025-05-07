'use client';

import { useEffect } from 'react';
import { cleanBodyAttributes, monitorBodyAttributes } from '@/lib/utils/hydration';

/**
 * HydrationFix component
 *
 * This component helps fix hydration mismatches by removing unexpected attributes
 * from the body tag after the component mounts on the client side.
 * It also sets up a MutationObserver to monitor and clean attributes that might be
 * added by browser extensions or third-party scripts.
 */
export default function HydrationFix() {
  useEffect(() => {
    // Clean body attributes immediately
    cleanBodyAttributes();

    // Set up monitoring for attribute changes
    const cleanup = monitorBodyAttributes();

    // Clean up observer on unmount
    return cleanup;
  }, []);

  // This component doesn't render anything
  return null;
}
