// Safe GA4 event helper
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Send custom events to Google Analytics 4
 * @param eventName The name of the event (e.g., 'click_hero_cta', 'decision_fe')
 * @param params Additional parameters to include with the event
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean | null>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  } else if (process.env.NODE_ENV === "development") {
    // Log event to console during development if GA is not loaded or disabled
    console.debug(`[Analytics Event] ${eventName}`, params);
  }
}
