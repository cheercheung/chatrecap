"use client";

import { Footer as FooterType } from "@/types/blocks/footer";
import Icon from "@/components/icon";
import { useTranslations } from "next-intl";

export default function Footer({ footer }: { footer: FooterType }) {
  const t = useTranslations("footer");

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

            {footer.social && (
              <ul className="flex items-center space-x-6 text-muted-foreground">
                {footer.social.items?.map((item, i) => (
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
            <p>{t("copyright")}</p>

            {footer.agreement && (
              <ul className="flex justify-center gap-4">
                {footer.agreement.items?.map((item, i) => (
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
