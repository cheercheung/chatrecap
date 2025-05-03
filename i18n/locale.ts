import { Pathnames } from "next-intl/routing";

export const locales = ["en", "es", "tr","it","de", "ko", "fr", "ja", "zh"];

export const localeNames: any = {
  en: "English",
  es: "Español",
  tr: "Türkçe",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  zh: "中文"
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  zh: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  es: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  fr: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  de: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  ja: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  ko: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
  tr: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
} satisfies Pathnames<typeof locales>;
