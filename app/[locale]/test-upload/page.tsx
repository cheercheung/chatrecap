import { UploadBox } from "@/components/blocks";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestUploadPage() {
  const [platform, setPlatform] = useState("whatsapp");

  // Sample upload box configuration
  const uploadBoxConfig = {
    name: "upload_box",
    title: "Test Upload Box",
    description: "Use sample or upload chat file, click FREE Analyze.",
    max_file_size: 5,
    placeholder: "Enter or paste your chat text here...",
    sample_chat_text: "This is a sample chat text for testing purposes.",
    sample_button_text: "Use Sample Input",
    upload_button_text: "Upload File",
    supported_formats: "",
    secondary_button: {
      title: "FREE Analyze",
      url: "/chatrecapresult",
      target: "_self",
      icon: "RiFileTextLine",
      variant: "secondary"
    }
  };

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center">Upload Box Test Page</h1>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={platform === "whatsapp" ? "default" : "outline"}
            onClick={() => setPlatform("whatsapp")}
          >
            WhatsApp
          </Button>
          <Button
            variant={platform === "instagram" ? "default" : "outline"}
            onClick={() => setPlatform("instagram")}
          >
            Instagram
          </Button>
          <Button
            variant={platform === "telegram" ? "default" : "outline"}
            onClick={() => setPlatform("telegram")}
          >
            Telegram
          </Button>
        </div>

        <div className="mb-4 text-center text-lg font-medium">
          Current Platform: <span className="text-primary">{platform}</span>
        </div>

        <UploadBox upload_box={uploadBoxConfig} platform={platform} />
      </div>
    </div>
  );
}
