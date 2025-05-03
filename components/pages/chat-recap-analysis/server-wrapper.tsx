import { getTranslations } from "next-intl/server";
import ClientChatRecapAnalysisPage from "./index";

export interface ChatRecapAnalysisServerWrapperProps {
  title?: string;
  subtitle?: string;
  description?: string;
  uploadBoxData?: any;
  platform?: string;
  className?: string;
}

/**
 * 服务器端包装组件，用于获取翻译并传递给客户端组件
 */
export default async function ChatRecapAnalysisServerWrapper({
  title,
  subtitle,
  description,
  uploadBoxData,
  platform,
  className
}: ChatRecapAnalysisServerWrapperProps) {
  // 在服务器端获取翻译
  const t = await getTranslations("chat_analysis");

  // 使用传入的值或从翻译中获取默认值
  const finalTitle = title || t("title");
  const finalSubtitle = subtitle || t("subtitle");
  const finalDescription = description || t("description");

  // 如果没有提供uploadBoxData，则创建默认值
  const finalUploadBoxData = uploadBoxData || {
    primary_button: {
      title: t("analyze_button"),
      url: "/chatrecapresult",
      target: "_self",
      variant: "default"
    },
    secondary_button: {
      title: t("free_analysis"),
      url: "/chatrecapanalysis",
      target: "_self",
      variant: "secondary"
    }
  };

  // 将翻译后的文本传递给客户端组件
  return (
    <ClientChatRecapAnalysisPage
      title={finalTitle}
      subtitle={finalSubtitle}
      description={finalDescription}
      uploadBoxData={finalUploadBoxData}
      platform={platform}
      className={className}
    />
  );
}
