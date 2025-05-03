"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AnalysisLoadingProps {
  fileId: string;
}

export default function AnalysisLoading({ fileId }: AnalysisLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 60; // 最多尝试60次，每次间隔3秒，总共最多等待3分钟
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/check-analysis-status?fileId=${fileId}`);
        const data = await response.json();
        
        if (data.success && data.data.completed) {
          // 分析完成，刷新页面（移除analyzing参数）
          clearInterval(interval);
          setIsLoading(false);
          
          // 使用replace而不是push，这样不会在历史记录中留下多余的条目
          router.replace(`/ai-insight-result?fileId=${fileId}`);
          
          // 刷新页面以获取最新的分析结果
          window.location.reload();
        } else {
          // 更新进度
          attempts++;
          const newProgress = Math.min(95, Math.floor((attempts / maxAttempts) * 100));
          setProgress(newProgress);
          
          if (attempts >= maxAttempts) {
            // 超过最大尝试次数，显示错误
            clearInterval(interval);
            setIsLoading(false);
            setError("分析超时，请刷新页面重试");
          }
        }
      } catch (error) {
        console.error("Check analysis status failed:", error);
        setError("检查分析状态失败，请刷新页面重试");
      }
    };
    
    // 立即检查一次
    checkStatus();
    
    // 每3秒检查一次
    interval = setInterval(checkStatus, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [fileId, router]);
  
  if (!isLoading && !error) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h3 className="text-xl font-semibold">AI 分析进行中...</h3>
              <p className="text-muted-foreground text-center">
                我们正在对您的聊天记录进行深度分析，这可能需要几分钟时间。
              </p>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{progress}%</p>
            </>
          ) : (
            <>
              <div className="text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">分析出错</h3>
              <p className="text-muted-foreground text-center">{error}</p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
