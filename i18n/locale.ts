import { Pathnames } from "next-intl/routing";

export const locales = ["en"];

export const localeNames: any = {
  en: "English"
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",}
  // ,
  // zh: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
  // es: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
  // fr: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
  // de: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
  // ja: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
  // ko: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
  // tr: {
  //   "privacy-policy": "/privacy-policy",
  //   "terms-of-service": "/terms-of-service",
  // },
} satisfies Pathnames<typeof locales>;
