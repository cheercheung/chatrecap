"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PlatformFilter from "@/components/blocks/platform-filter";
import JsonUploader from "@/components/blocks/json-uploader";
import UploadBoxWrapper from "@/components/blocks/upload-box/server-wrapper";
import PlatformGuide from "@/components/blocks/platform-guide";
import { Section } from "@/types/blocks/section";
import { UploadBox as UploadBoxType } from "@/types/blocks/upload-box";
import { PlatformType } from "@/types/chat-processing";

interface PlatformOption {
  id: string;
  label: string;
}

export interface PlatformUploadProps {
  section: Section;
  upload_box: UploadBoxType;
  className?: string;
}

export default function PlatformUpload({ section, upload_box, className }: PlatformUploadProps) {
  const t = useTranslations("chat_analysis");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("whatsapp");

  // Get platform options from i18n
  const platformOptions: PlatformOption[] = [
    { id: "whatsapp", label: t("platforms.whatsapp") },
    { id: "instagram", label: t("platforms.instagram") },
    { id: "discord", label: t("platforms.discord") },
    { id: "telegram", label: t("platforms.telegram") },
    { id: "snapchat", label: t("platforms.snapchat") }
  ];

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId as PlatformType);
  };

  // Default values from i18n
  const defaultSection = {
    title: t("upload_title"),
    description: t("upload_description")
  };

  // Default values from i18n
  const defaultUploadBox: UploadBoxType = {
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

  // 使用提供的值或默认值
  const sectionData = section || defaultSection;
  const uploadBoxData = upload_box || defaultUploadBox;

  return (
    <section className={`${section ? 'py-16' : 'py-8'} relative`}>
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
