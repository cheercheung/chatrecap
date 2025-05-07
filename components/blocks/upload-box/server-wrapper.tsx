"use client";

import { useTranslations } from "next-intl";
import UploadBox from "./index";
import { UploadBox as UploadBoxType } from "@/types/blocks/upload-box";

export interface UploadBoxServerWrapperProps {
  upload_box: UploadBoxType;
  platform?: string;
}

/**
 * 客户端包装组件，用于获取翻译并传递给UploadBox组件
 */
export default function UploadBoxServerWrapper({
  upload_box,
  platform = "whatsapp"
}: UploadBoxServerWrapperProps) {
  // 在客户端获取翻译
  const t = useTranslations("chat_analysis");

  // 添加翻译文本到upload_box
  const uploadBoxWithTranslations = {
    ...upload_box,
    sample_button_text: upload_box.sample_button_text || t("sample_button_text"),
    upload_button_text: upload_box.upload_button_text || t("upload_button_text"),
    supported_formats: upload_box.supported_formats || t("supported_formats"),
    placeholder: upload_box.placeholder || t("placeholder"),
    sample_chat_text: upload_box.sample_chat_text || t("sample_chat_text"),
    primary_button: {
      ...upload_box.primary_button,
      title: upload_box.primary_button?.title || t("analyze_button")
    },
    secondary_button: {
      ...upload_box.secondary_button,
      title: upload_box.secondary_button?.title || t("free_analysis")
    }
  };

  // 将翻译后的文本和平台信息传递给客户端组件
  return <UploadBox upload_box={uploadBoxWithTranslations} platform={platform} />;
}
