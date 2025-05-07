'use client';

/**
 * Utility functions to help with hydration issues
 */

/**
 * Removes unexpected attributes from the body tag
 * This can help fix hydration mismatches
 */
export function cleanBodyAttributes(): void {
  if (typeof document === 'undefined') return;
  
  // List of attributes that might be added by browser extensions or third-party scripts
  const unexpectedAttributes = [
    'inmaintabuse',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed'
  ];
  
  // Remove any unexpected attributes
  unexpectedAttributes.forEach(attr => {
    if (document.body.hasAttribute(attr)) {
      document.body.removeAttribute(attr);
    }
  });
}

/**
 * Adds a MutationObserver to monitor and clean body attributes
 * This can help prevent hydration mismatches caused by attributes added after initial render
 */
export function monitorBodyAttributes(): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {}; // Return empty cleanup function for SSR
  }
  
  // Clean initial attributes
  cleanBodyAttributes();
  
  // Set up observer to monitor attribute changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName) {
        const attributeName = mutation.attributeName;
        if (attributeName === 'inmaintabuse') {
          document.body.removeAttribute(attributeName);
        }
      }
    });
  });
  
  // Start observing the body element for attribute changes
  observer.observe(document.body, { attributes: true });
  
  // Return cleanup function
  return () => observer.disconnect();
}
