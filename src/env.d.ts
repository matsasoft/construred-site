/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  readonly PUBLIC_CMS_API_URL?: string;
  readonly CMS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
