"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PlatformType } from "@/types/chat-processing";

// Format description text, handling special delimiters
function formatDescription(description: string): string[] {
  // Replace common delimiters with line breaks
  let formattedText = description
    .replace(/(\d+\.\s)/g, '\n$1') // Numbered list items
    .replace(/(\w+:)/g, '\n$1') // Words followed by colons
    .replace(/(\.\s*Note:)/g, '.\n\nNote:') // "Note:" after a period
    .replace(/\//g, '\n') // Slash delimiters
    .replace(/(\w+)\s*→\s*(\w+)/g, '$1 → $2') // Arrow symbols
    .trim();

  // Split into lines
  return formattedText.split('\n').filter(line => line.trim() !== '');
}

interface PlatformGuideProps {
  platform: PlatformType;
  exportTitle?: string;
}

export default function PlatformGuide({ platform, exportTitle = "How to Export Your Chat" }: PlatformGuideProps) {
  // We're using hardcoded values now to avoid translation issues
  // const t = useTranslations("landing");

  // Get platform name for title
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
  const title = exportTitle.replace('{platform}', platformName);

  // Determine layout type based on platform
  const isWhatsAppLayout = platform === "whatsapp";
  const isVerticalLayout = platform === "instagram" || platform === "snapchat";
  const isHorizontalLayout = platform === "discord" || platform === "telegram";

  // WhatsApp layout (2 columns)
  if (isWhatsAppLayout) {
    // Get WhatsApp data directly from translations with fallbacks
    const img1 = {
      src: `/imgs/output/whatsapp/1.png`, // Use hardcoded path to avoid URL issues
      alt: "WhatsApp Chat Export Step",
      description: "From WhatsApp Web"
    };

    const img2 = {
      src: `/imgs/output/whatsapp/2.png`, // Use hardcoded path to avoid URL issues
      alt: "WhatsApp Chat Export Step",
      description: "From WhatsApp iOS/Android"
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={platform}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="border border-primary/10 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] min-h-[300px] mb-3">
                    <Image
                      src={img1.src}
                      alt={img1.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    {img1.description}
                  </p>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] min-h-[300px] mb-3">
                    <Image
                      src={img2.src}
                      alt={img2.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    {img2.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Instagram & Snapchat layout (vertical)
  if (isVerticalLayout) {
    // Use hardcoded values to avoid URL issues
    const platformData = {
      src: `/imgs/output/${platform}/1.png`,
      alt: `${platformName} Chat Export Guide`,
      description: platform === "instagram"
        ? "Export Steps: Settings > Accounts Center > Your information and permissions > Download or transfer information. Note: After requesting your data, Instagram will email you a download link within 48 hours. The chat history will be in JSON format."
        : "Go to Settings → My Data. Select 'Export JSON Files' for data portability purposes. Make sure 'Chat History' is selected. Submit your request and wait for the email. Download the ZIP file and extract it. Find the 'chat_history.json' file in the extracted folder. Upload this JSON file below."
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={platform}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="border border-primary/10 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] mb-4">
                  <Image
                    src={platformData.src}
                    alt={platformData.alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-sm text-centeqgur text-muted-foreground">
                  {platformData.description && formatDescription(platformData.description).map((line, index) => (
                    <p key={index} className={index > 0 ? "mt-1" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Discord & Telegram layout (horizontal)
  if (isHorizontalLayout) {
    // Use hardcoded values to avoid URL issues
    const platformData = {
      src: `/imgs/output/${platform}/1.png`,
      alt: `${platformName} Chat Export Guide`,
      description: platform === "discord"
        ? "Export Steps: 1. Download and install Discord Chat Exporter. 2. Get your Discord token. 3. Export chat history to JSON format. Note: Using third-party tools like Discord Chat Exporter may violate Discord's Terms of Service. Please use at your own risk."
        : "Export Steps: 1. Open Telegram Desktop app. 2. Go to Chat → Export Chat History. 3. Export with no media in JSON format. Note: Please ensure you have the latest version of Telegram Desktop installed. The export feature is only available in the desktop application."
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={platform}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="border border-primary/10 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-full md:w-1/2 aspect-[4/3] min-h-[300px]">
                  <Image
                    src={platformData.src}
                    alt={platformData.alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="text-sm text-muted-foreground">
                    {platformData.description && formatDescription(platformData.description).map((line, index) => (
                      <p key={index} className={index > 0 ? "mt-1" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Fallback layout if no valid data is found
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={platform}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="border border-primary/10 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] mb-4">
                <Image
                  src={`/imgs/output/${platform}/1.png`}
                  alt={`${platformName} Chat Export Guide`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Please select a platform to see export instructions.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
