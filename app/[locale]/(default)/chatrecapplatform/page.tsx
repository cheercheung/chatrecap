import { getTranslations } from "next-intl/server";
import ChatRecapPlatformPage from "@/components/pages/chat-recap-platform";
import Icon from "@/components/icon";

// 强制使用服务器端渲染
export const dynamic = 'force-dynamic';

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("chatrecapplatform");

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/chatrecapplatform`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/chatrecapplatform`;
  }

  return {
    title: t("metadata.title", { defaultValue: "Chat Platform Selection" }),
    description: t("metadata.description", { defaultValue: "Choose your chat platform to analyze your conversations" }),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Chat Recap Platform Page
 *
 * This page displays a selection of chat platforms for the user to choose from.
 */
export default async function ChatRecapPlatformRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("platforms");

  // Define platform data with icons
  const platforms = [
    {
      name: "WhatsApp",
      title: t("whatsapp.title", { defaultValue: "Chat Recap in WhatsApp" }),
      description: t("whatsapp.description"),
      downloadGuide: t("whatsapp.download_guide", { defaultValue: "Request your WhatsApp data through the app settings to get started." }),
      guideLink: "https://faq.whatsapp.com/general/account-and-profile/how-to-request-your-account-information",
      actionText: t("whatsapp.button"),
      icon: <Icon name="RiWhatsappFill" className="text-xl" />
    },
    {
      name: "Instagram",
      title: t("instagram.title", { defaultValue: "Chat Recap in Instagram" }),
      description: t("instagram.description"),
      downloadGuide: t("instagram.download_guide", { defaultValue: "Access and download your information from Instagram Accounts Center." }),
      guideLink: "https://help.instagram.com/181231772500920#download-a-copy-of-your-information-in-accounts-center",
      actionText: t("instagram.button"),
      icon: <Icon name="RiInstagramFill" className="text-xl" />
    },
    {
      name: "Snapchat",
      title: t("snapchat.title", { defaultValue: "Chat Recap in Snapchat" }),
      description: t("snapchat.description"),
      downloadGuide: t("snapchat.download_guide", { defaultValue: "Download your Snapchat data from your account settings." }),
      guideLink: "https://help.snapchat.com/hc/en-us/articles/7012305371156-How-do-I-download-my-data-from-Snapchat",
      actionText: t("snapchat.button"),
      icon: <Icon name="RiSnapchatFill" className="text-xl" />
    },
    {
      name: "Telegram",
      title: t("telegram.title", { defaultValue: "Chat Recap in Telegram" }),
      description: t("telegram.description"),
      downloadGuide: t("telegram.download_guide", { defaultValue: "Export your chat history using Telegram's built-in export tool." }),
      guideLink: "https://telegram.org/blog/export-and-more",
      actionText: t("telegram.button"),
      icon: <Icon name="RiTelegramFill" className="text-xl" />
    },
    {
      name: "Discord",
      title: t("discord.title", { defaultValue: "Chat Recap in Discord" }),
      description: t("discord.description"),
      downloadGuide: t("discord.download_guide", { defaultValue: "Use Discord Chat Exporter to download your chat history." }),
      guideLink: "https://github.com/Tyrrrz/DiscordChatExporter/blob/master/.docs/Getting-started.md",
      actionText: t("discord.button"),
      icon: <Icon name="RiDiscordFill" className="text-xl" />
    }
  ];

  return (
    <ChatRecapPlatformPage
      pageTitle={t("title")}
      pageDescription={t("description")}
      platforms={platforms}
      guideText={t("view_guide", { defaultValue: "View download guide" })}
    />
  );
}
