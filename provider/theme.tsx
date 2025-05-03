"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // 检查localStorage中是否有保存的主题
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && ["dark", "light"].includes(savedTheme)) {
        setTheme(savedTheme);
        return;
      }

      // 如果没有保存的主题，检查默认主题
      const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME;
      if (defaultTheme && ["dark", "light"].includes(defaultTheme)) {
        setTheme(defaultTheme);
        return;
      }

      // 如果没有默认主题，使用系统主题
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mediaQuery.matches ? "dark" : "light");

      const handleChange = () => {
        setTheme(mediaQuery.matches ? "dark" : "light");
      };

      // 使用正确的事件监听器方法
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // 兼容旧版浏览器
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  return (
    <NextThemesProvider forcedTheme={theme} {...props}>
      {children}
      <Toaster position="top-center" richColors />
    </NextThemesProvider>
  );
}
