// Global type declarations for the application

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    adsbygoogle?: unknown[];
  }
}

export {}
