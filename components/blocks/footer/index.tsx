"use client";

import { Footer as FooterType } from "@/types/blocks/footer";
import Icon from "@/components/icon";
import { useTranslations } from "next-intl";

export default function Footer({ footer }: { footer: FooterType }) {
  // 使用 footer 命名空间和组件命名空间作为备用
  let t;
  let componentT;
  try {
    t = useTranslations("footer");
    componentT = useTranslations("components.footer");
  } catch (error) {
    // 如果找不到命名空间，使用一个函数返回默认值
    t = (key: string) => key;
    componentT = (key: string) => {
      const defaultValues: Record<string, string> = {
        "copyright": "© 2024 Chat Recap AI. All rights reserved."
      };
      return defaultValues[key] || key;
    };
  }

  if (footer.disabled) {
    return null;
  }

  return (
    <section id={footer.name} className="py-8">
      <div className="max-w-7xl mx-auto px-8">
        <footer>
          <div className="flex flex-col items-center justify-between gap-6 text-center">
            {footer.brand && (
              <div className="flex items-center justify-center gap-2">
                {footer.brand.logo && (
                  <img
                    src={footer.brand.logo.src}
                    alt={footer.brand.logo.alt || footer.brand.title}
                    className="h-11"
                  />
                )}
                {footer.brand.title && (
                  <p className="text-3xl font-semibold">
                    {footer.brand.title}
                  </p>
                )}
              </div>
            )}

            {footer.social && footer.social.items && Array.isArray(footer.social.items) && (
              <ul className="flex items-center space-x-6 text-muted-foreground">
                {footer.social.items.map((item, i) => (
                  <li key={i} className="font-medium hover:text-primary">
                    <a href={item.url} target={item.target} title={item.title}>
                      {item.icon && (
                        <Icon name={item.icon} className="size-6" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t pt-6 text-center text-sm font-medium text-muted-foreground">
            <p>{t("copyright") || componentT("copyright")}</p>

            {footer.agreement && footer.agreement.items && Array.isArray(footer.agreement.items) && (
              <ul className="flex justify-center gap-4">
                {footer.agreement.items.map((item, i) => (
                  <li key={i} className="hover:text-primary">
                    <a href={item.url} target={item.target}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
