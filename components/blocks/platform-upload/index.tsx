"use client";

import { useState } from "react";
import PlatformFilter from "@/components/blocks/platform-filter";
import JsonUploader from "@/components/blocks/json-uploader";
import UploadBoxWrapper from "@/components/blocks/upload-box/server-wrapper";
import PlatformGuide from "@/components/blocks/platform-guide";
import { Section } from "@/types/blocks/section";
import { UploadBox as UploadBoxType } from "@/types/blocks/upload-box";
import { PlatformType } from "@/types/chat-processing";
// 导入静态翻译
import { landingTranslations } from '@/lib/static-translations';

interface PlatformOption {
  id: string;
  label: string;
}

export interface PlatformUploadProps {
  section: Section;
  upload_box: UploadBoxType;
}

export default function PlatformUpload({ section, upload_box }: PlatformUploadProps) {
  // 使用静态翻译，不再需要额外参数
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("whatsapp");

  // 从静态翻译中获取平台选项
  const platformOptions: PlatformOption[] = [
    { id: "whatsapp", label: landingTranslations.platforms.whatsapp.title },
    { id: "instagram", label: landingTranslations.platforms.instagram.title },
    { id: "discord", label: landingTranslations.platforms.discord.title },
    { id: "telegram", label: landingTranslations.platforms.telegram.title },
    { id: "snapchat", label: landingTranslations.platforms.snapchat.title }
  ];

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId as PlatformType);
  };

  // 默认值，使用静态翻译
  const defaultSection = {
    title: "How to export Your Chat Data",
    description: "Select your messaging platform and upload your chat data for analysis"
  };

  // 默认值，使用静态翻译
  const defaultUploadBox: UploadBoxType = {
    primary_button: {
      title: "AI Recap",
      url: "/chatrecapresult",
      target: "_self",
      variant: "default"
    },
    secondary_button: {
      title: "FREE Analyze",
      url: "/chatrecapanalysis",
      target: "_self",
      variant: "secondary"
    }
  };

  // 使用提供的值或默认值
  const sectionData = section || defaultSection;
  const uploadBoxData = upload_box || defaultUploadBox;

  return (
    <section className="py-16 relative">
      <div className="container max-w-4xl">
        {section && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">{sectionData.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{sectionData.description}</p>
          </div>
        )}

        <div className="mb-8">
          <PlatformFilter
            options={platformOptions}
            defaultSelected="whatsapp"
            onChange={handlePlatformChange}
          />
        </div>

        {/* Platform export guide */}
        <PlatformGuide
          platform={selectedPlatform}
          exportTitle={`How to Export Your {platform} Chat`}
        />

        {selectedPlatform === "whatsapp" ? (
          <UploadBoxWrapper upload_box={uploadBoxData} platform={selectedPlatform} />
        ) : (
          <JsonUploader
            supportedPlatform={platformOptions.find(p => p.id === selectedPlatform)?.label}
            platform={selectedPlatform}
            analyzeButton={{
              title: uploadBoxData.secondary_button?.title || "FREE Analyze",
              url: uploadBoxData.secondary_button?.url || "/chatrecapresult",
              target: uploadBoxData.secondary_button?.target || "_self",
              // 只有当 icon 存在时才包含它
              ...(uploadBoxData.secondary_button?.icon ? { icon: uploadBoxData.secondary_button.icon } : {}),
              variant: uploadBoxData.secondary_button?.variant || "secondary"
            }}
          />
        )}
      </div>
    </section>
  );
}
