"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadBox as UploadBoxType } from "@/types/blocks/upload-box";
import Icon from "@/components/icon";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, AlertCircle, Upload as UploadIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
// Remove useTranslations import to avoid internationalization context issues
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { RiUploadCloud2Line } from "react-icons/ri";

export default function UploadBox({ upload_box, platform = "whatsapp" }: { upload_box: UploadBoxType, platform?: string }) {
  const router = useRouter();
  // Create a simple translation function that returns default values
  const t = (key: string) => {
    const translations = {
      'upload.no_file_selected': 'Please select a file or enter text first',
      'processing.failed': 'Processing failed'
    };
    return translations[key] || key;
  };
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");
  // Platform is now passed as a prop with whatsapp as default

  const handleSampleClick = () => {
    // 使用示例文本
    setText(upload_box.sample_chat_text || "");
    setIsSampleData(true);
    // Switch to paste tab when using sample data
    setActiveTab("paste");
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
        // Switch to paste tab if we've loaded text content
        setActiveTab("paste");
      };
      reader.readAsText(file);
    } else {
      // For non-text files, make sure we're in upload tab
      setActiveTab("upload");
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 共享的文件上传和处理逻辑
  const uploadAndProcessFile = async (): Promise<string | null> => {
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

      return data.fileId;
    } catch (error) {
      console.error("Processing failed:", error);
      setError(error instanceof Error ? error.message : String(error));
      return null;
    }
  };



  // FREE Analyze 按钮处理函数
  const handleFreeAnalyzeClick = async () => {
    if (!file && !text && !isSampleData) {
      setError(t('upload.no_file_selected'));
      return;
    }

    // 如果是示例数据，直接跳转到基础分析结果示例页面
    if (isSampleData) {
      router.push("/chatrecapresult/sample");
      return;
    }

    try {
      const fileId = await uploadAndProcessFile();

      if (!fileId) {
        throw new Error(t('processing.failed'));
      }

      // 重定向到基础分析结果页面
      router.push(`/chatrecapresult?fileId=${fileId}`);
    } catch (error) {
      console.error("FREE Analyze processing failed:", error);
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <Icon name="RiFileTextLine" className="h-4 w-4" />
                  Paste Chat
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Icon name="RiUploadLine" className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paste" className="mt-0">
                <div className="mb-6">
                  <Textarea
                    placeholder={upload_box.placeholder}
                    className="min-h-[200px] resize-vertical border-primary/20 focus:border-primary/50 leading-relaxed text-base"
                    style={{ lineHeight: "1.8", letterSpacing: "0.01em" }}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      // 如果用户手动输入文本，则不是示例数据
                      if (isSampleData && e.target.value !== upload_box.sample_chat_text) {
                        setIsSampleData(false);
                      }
                    }}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={handleSampleClick}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                      {upload_box.sample_button_text}
                      <Sparkles className="h-4 w-4 text-primary" />
                    </Button>

                    {/* 字符计数 */}
                    <div className="text-sm font-medium flex items-center gap-1">
                      <span className={`${text.length > 900000 ? 'text-red-500' : text.length > 700000 ? 'text-amber-500' : 'text-primary'}`}>
                        {text.length.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/1,000,000</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3 mt-4">
                    <button
                      type="button"
                      className="text-xs text-muted-foreground flex items-center hover:text-foreground transition-colors"
                      onClick={() => setText("")}
                    >
                      <Icon name="RiCloseLine" className="h-3 w-3 mr-1" />
                      Clear input
                    </button>

                    {upload_box.secondary_button && (
                      <Button
                        variant={upload_box.secondary_button.variant as any || "secondary"}
                        onClick={handleFreeAnalyzeClick}
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
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="border-2 border-dashed border-primary/20 rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                    onClick={handleUploadClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt,.zip,.json,.csv"
                    />

                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                      }}
                    >
                      <RiUploadCloud2Line className="w-16 h-16 text-primary/40 mb-4" />
                    </motion.div>

                    <p className="text-lg font-medium text-primary mb-2">
                      Click to upload your chat file
                    </p>

                    {fileName ? (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Selected: {fileName}
                      </motion.p>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <p className="text-sm text-muted-foreground">Drag and drop or click to browse files</p>
                      </motion.div>
                    )}
                  </motion.div>

                  <div className="flex justify-between items-center mb-6">
                    {fileName && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground flex items-center hover:text-foreground transition-colors"
                        onClick={() => {
                          setFile(null);
                          setFileName("");
                        }}
                      >
                        <Icon name="RiCloseLine" className="h-3 w-3 mr-1" />
                        Clear file
                      </button>
                    )}

                    {upload_box.secondary_button && (
                      <Button
                        variant={upload_box.secondary_button.variant as any || "secondary"}
                        className="ml-auto"
                        onClick={handleFreeAnalyzeClick}
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
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
                <AlertTitle>Processing Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
