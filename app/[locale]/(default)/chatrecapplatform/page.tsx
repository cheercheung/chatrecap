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
    title: t("meta.title"),
    description: t("meta.description"),
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
  const t = await getTranslations("chatrecapplatform");

  // Define platform data with icons
  const platforms = [
    {
      name: "WhatsApp",
      title: t("platforms.whatsapp.title", { defaultValue: "Chat Recap in WhatsApp" }),
      description: t("platforms.whatsapp.description"),
      downloadGuide: t("platforms.whatsapp.download_guide", { defaultValue: "Request your WhatsApp data through the app settings to get started." }),
      guideLink: "https://faq.whatsapp.com/general/account-and-profile/how-to-request-your-account-information",
      actionText: t("select_button"),
      icon: <Icon name="RiWhatsappFill" className="text-xl" />
    },
    {
      name: "Instagram",
      title: t("platforms.instagram.title", { defaultValue: "Chat Recap in Instagram" }),
      description: t("platforms.instagram.description"),
      downloadGuide: t("platforms.instagram.download_guide", { defaultValue: "Access and download your information from Instagram Accounts Center." }),
      guideLink: "https://help.instagram.com/181231772500920#download-a-copy-of-your-information-in-accounts-center",
      actionText: t("select_button"),
      icon: <Icon name="RiInstagramFill" className="text-xl" />
    },
    {
      name: "Snapchat",
      title: t("platforms.snapchat.title", { defaultValue: "Chat Recap in Snapchat" }),
      description: t("platforms.snapchat.description"),
      downloadGuide: t("platforms.snapchat.download_guide", { defaultValue: "Download your Snapchat data from your account settings." }),
      guideLink: "https://help.snapchat.com/hc/en-us/articles/7012305371156-How-do-I-download-my-data-from-Snapchat",
      actionText: t("select_button"),
      icon: <Icon name="RiSnapchatFill" className="text-xl" />
    },
    {
      name: "Telegram",
      title: t("platforms.telegram.title", { defaultValue: "Chat Recap in Telegram" }),
      description: t("platforms.telegram.description"),
      downloadGuide: t("platforms.telegram.download_guide", { defaultValue: "Export your chat history using Telegram's built-in export tool." }),
      guideLink: "https://telegram.org/blog/export-and-more",
      actionText: t("select_button"),
      icon: <Icon name="RiTelegramFill" className="text-xl" />
    },
    {
      name: "Discord",
      title: t("platforms.discord.title", { defaultValue: "Chat Recap in Discord" }),
      description: t("platforms.discord.description"),
      downloadGuide: t("platforms.discord.download_guide", { defaultValue: "Use Discord Chat Exporter to download your chat history." }),
      guideLink: "https://github.com/Tyrrrz/DiscordChatExporter/blob/master/.docs/Getting-started.md",
      actionText: t("select_button"),
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
