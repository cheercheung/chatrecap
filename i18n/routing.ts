// import {
//   defaultLocale,
//   localeDetection,
//   localePrefix,
//   locales,
//   pathnames,
// } from "./locale";

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

// Temporarily override locales to only support English
const supportedLocales = ['en'];
const defaultLocaleOverride = 'en';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale: defaultLocaleOverride,
  localePrefix: 'as-needed',
  pathnames: {
    en: {
      "privacy-policy": "/privacy-policy",
      "terms-of-service": "/terms-of-service",
    }
  },
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
