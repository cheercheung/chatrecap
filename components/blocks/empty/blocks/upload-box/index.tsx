"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadBox as UploadBoxType } from "@/types/blocks/upload-box";
import Icon from "@/components/icon";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function UploadBox({ upload_box }: { upload_box: UploadBoxType }) {
  const router = useRouter();
  const t = useTranslations("chat_analysis");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);
  const platform = "whatsapp"; // WhatsApp is the default platform for UploadBox

  const handleSampleClick = () => {
    // 使用i18n中的示例文本
    setText(t("sample_chat_text"));
    setIsSampleData(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > (upload_box.max_file_size || 5) * 1024 * 1024) {
      setError(`File size exceeds ${upload_box.max_file_size || 5}MB limit`);
      return;
    }

    // Check file extension
    const validExtensions = [".txt", ".zip", ".json", ".csv"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setError(`Invalid file format. Supported formats: ${validExtensions.join(", ")}`);
      return;
    }

    setFileName(file.name);
    setFile(file);
    setError(null);
    setIsSampleData(false); // 用户上传了自己的文件，不是示例数据

    // Read file content if it's a text file
    if (fileExtension === ".txt") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process file for recap or analyze
  const handleProcessClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!file && !text) {
      setError("Please select a file or enter text first");
      return;
    }

    // 如果是示例数据，根据按钮类型决定跳转到哪个页面
    if (isSampleData) {
      // 检查是哪个按钮触发的处理
      const isAiRecap = event?.currentTarget === primaryButtonRef.current;

      if (isAiRecap) {
        // 如果是AI Recap按钮，跳转到AI分析结果页面
        router.push("/ai-insight-result");
      } else {
        // 如果是FREE Analyze按钮，跳转到基础分析结果页面
        router.push("/chatrecapresult");
      }
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      let uploadedFile = file;

      // If we have text but no file, create a file from the text
      if (!file && text) {
        const blob = new Blob([text], { type: "text/plain" });
        uploadedFile = new File([blob], "chat-text.txt", { type: "text/plain" });
      }

      if (!uploadedFile) {
        throw new Error("No file to upload");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("platform", platform);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      // Send upload request
      const response = await fetch("/api/chat-processing/upload", {
        method: "POST",
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setProgress(100);
      setFileId(data.fileId);

      // Start processing file
      setProcessing(true);

      const processResponse = await fetch("/api/chat-processing/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileId: data.fileId,
          platform
        })
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.message || "Processing failed");
      }

      // 检查是哪个按钮触发的处理
      // 如果是主按钮（AI Recap），则重定向到支付页面
      // 如果是次要按钮（FREE Analyze），则重定向到基础分析结果页面
      const isAiRecap = event?.currentTarget === primaryButtonRef.current;

      if (isAiRecap) {
        // 重定向到支付页面
        router.push(`/payment?fileId=${data.fileId}`);
      } else {
        // 重定向到基础分析结果页面
        router.push(`/chatrecapresult?fileId=${data.fileId}`);
      }

    } catch (error) {
      console.error("Processing failed:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <section className="py-8 relative">
      <div className="container max-w-4xl">

        <Card className="border border-primary/10 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="mb-6">
              <Textarea
                placeholder={upload_box.placeholder}
                className="min-h-[200px] resize-none border-primary/20 focus:border-primary/50"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  // 如果用户手动输入文本，则不是示例数据
                  if (isSampleData && e.target.value !== t("sample_chat_text")) {
                    setIsSampleData(false);
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                onClick={handleSampleClick}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {upload_box.sample_button_text}
                <Sparkles className="h-4 w-4 text-primary" />
              </Button>

              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.zip"
                />
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleUploadClick}
                >
                  <Icon name="RiUploadLine" className="mr-2" />
                  {upload_box.upload_button_text}
                </Button>
                {fileName && (
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {fileName}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              {upload_box.supported_formats}
            </p>

            {/* Upload progress */}
            {uploading && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>{processing ? "Processing..." : "Uploading..."}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Error message */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              {upload_box.secondary_button && (
                <Button
                  variant={upload_box.secondary_button.variant as any || "secondary"}
                  className="w-full sm:w-auto"
                  onClick={handleProcessClick}
                  disabled={(!file && !text) || uploading || processing}
                >
                  {uploading || processing ? "Processing..." : (
                    <>
                      {upload_box.secondary_button.icon && (
                        <Icon name={upload_box.secondary_button.icon} className="mr-2" />
                      )}
                      {upload_box.secondary_button.title}
                    </>
                  )}
                </Button>
              )}

              {upload_box.primary_button && (
                <Button
                  ref={primaryButtonRef}
                  variant={upload_box.primary_button.variant as any || "default"}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-pink-500 hover:from-primary hover:to-pink-600"
                  onClick={handleProcessClick}
                  disabled={(!file && !text) || uploading || processing}
                >
                  {uploading || processing ? "Processing..." : (
                    <>
                      {upload_box.primary_button.title}
                      {upload_box.primary_button.icon && (
                        <Icon name={upload_box.primary_button.icon} className="ml-2" />
                      )}
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
