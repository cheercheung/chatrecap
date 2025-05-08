"use client";

import UploadBox from "./index";
import { UploadBox as UploadBoxType } from "@/types/blocks/upload-box";
// 导入静态翻译
import { landingTranslations } from '@/lib/static-translations';

export interface UploadBoxServerWrapperProps {
  upload_box: UploadBoxType;
  platform?: string;
}

/**
 * 客户端包装组件，直接传递数据给UploadBox组件
 * 不再使用useTranslations钩子，避免国际化上下文问题
 */
export default function UploadBoxServerWrapper({
  upload_box,
  platform = "whatsapp"
}: UploadBoxServerWrapperProps) {
  // 使用静态翻译
  const defaultTranslations = {
    sample_button_text: landingTranslations.upload.sample_button_text || "Use Sample Input",
    upload_button_text: landingTranslations.upload.upload_button_text || "Upload File",
    supported_formats: landingTranslations.upload.supported_formats || "Supported: .txt file or .zip containing a .txt file (max 5MB)",
    placeholder: landingTranslations.upload.placeholder || "Enter or paste your chat text here...",
    sample_chat_text: landingTranslations.upload.sample_chat_text || "Sample chat text...",
    analyze_button: landingTranslations.upload.upload_box?.primary_button?.title || "AI Recap",
    free_analysis: landingTranslations.upload.upload_box?.secondary_button?.title || "FREE Analyze"
  };

  // 添加默认文本到upload_box
  const uploadBoxWithTranslations = {
    ...upload_box,
    sample_button_text: upload_box.sample_button_text || defaultTranslations.sample_button_text,
    upload_button_text: upload_box.upload_button_text || defaultTranslations.upload_button_text,
    supported_formats: upload_box.supported_formats || defaultTranslations.supported_formats,
    placeholder: upload_box.placeholder || defaultTranslations.placeholder,
    sample_chat_text: upload_box.sample_chat_text || defaultTranslations.sample_chat_text,
    primary_button: {
      ...upload_box.primary_button,
      title: upload_box.primary_button?.title || defaultTranslations.analyze_button
    },
    secondary_button: {
      ...upload_box.secondary_button,
      title: upload_box.secondary_button?.title || defaultTranslations.free_analysis
    }
  };

  // 将翻译后的文本和平台信息传递给客户端组件
  return <UploadBox upload_box={uploadBoxWithTranslations} platform={platform} />;
}
