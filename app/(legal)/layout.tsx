import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";
import React from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  // 使用英语和正确的命名空间路径
  const t = await getTranslations({ locale: 'en', namespace: 'seo.metadata' });

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <a
        className="text-base-content cursor-pointer hover:opacity-80 transition-opacity"
        href="/"
      >
        <MdOutlineHome className="text-2xl mx-8 my-8" />
        <img className="w-10 h-10 mx-4 my-4" src={`/logo.png?v=${new Date().getTime()}`} alt="logo" />
      </a>
      <div className="text-md max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8 prose prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-base-content prose-code:text-base-content prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
        {children}
      </div>
    </div>
  );
}
