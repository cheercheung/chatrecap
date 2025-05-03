"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartBeat } from "@/components/ui/heart-beat";
import { ExternalLink } from "lucide-react";
import { ChatRecapPlatformPageProps } from "./types";

/**
 * Chat Recap Platform Page Component
 *
 * Displays a selection of chat platforms for the user to choose from.
 */
const ChatRecapPlatformPage: React.FC<ChatRecapPlatformPageProps> = ({
  pageTitle,
  pageDescription,
  platforms,
  guideText,
  className
}) => {
  const router = useRouter();
  const t = useTranslations("chatrecapplatform");

  const handlePlatformSelect = (platformName: string) => {
    router.push(`/chatrecapanalysis?platform=${platformName.toLowerCase()}`);
  };

  return (
    <main className={`container py-10 ${className}`}>
      <div className="relative">
        <HeartBeat className="absolute inset-0 opacity-10" />

        <div className="relative z-10 max-w-3xl mx-auto text-center mb-12">
          <div className="mb-4">
            <Badge className="bg-primary/80 hover:bg-primary/90">
              {t("badge")}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
            {pageTitle}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {platform.icon && (
                      <span className="text-primary text-xl">
                        {platform.icon}
                      </span>
                    )}
                    {platform.title}
                  </CardTitle>
                  <CardDescription>
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {platform.downloadGuide}
                  </p>
                  <a
                    href={platform.guideLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                  >
                    {guideText}
                    <ExternalLink size={14} />
                  </a>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    onClick={() => handlePlatformSelect(platform.name)}
                  >
                    {platform.actionText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ChatRecapPlatformPage;
