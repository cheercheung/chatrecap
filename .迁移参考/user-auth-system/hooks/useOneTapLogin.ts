"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

/**
 * Google One Tap 登录钩子
 */
export default function useOneTapLogin() {
  const { data: session } = useSession();

  useEffect(() => {
    // 如果已登录或不支持Google One Tap，则不显示
    if (
      session ||
      process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED !== "true" ||
      !process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID
    ) {
      return;
    }

    // 加载Google One Tap脚本
    const googleScript = document.createElement("script");
    googleScript.src = "https://accounts.google.com/gsi/client";
    googleScript.async = true;
    googleScript.defer = true;
    document.head.appendChild(googleScript);

    // 初始化Google One Tap
    googleScript.onload = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
        callback: async (response) => {
          if (response.credential) {
            // 使用Google One Tap凭证登录
            await signIn("google-one-tap", {
              credential: response.credential,
              redirect: false,
            });
          }
        },
        auto_select: true,
      });

      // 显示Google One Tap按钮
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google One Tap not displayed or skipped");
        }
      });
    };

    // 清理函数
    return () => {
      document.head.removeChild(googleScript);
      // 取消Google One Tap
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [session]);
}
