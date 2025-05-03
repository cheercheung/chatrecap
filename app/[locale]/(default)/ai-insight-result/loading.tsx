"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-semibold">AI 分析进行中...</h3>
          <p className="text-muted-foreground text-center">
            我们正在对您的聊天记录进行深度分析，这可能需要几分钟时间。
          </p>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: "50%" }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">请耐心等待...</p>
        </div>
      </div>
    </div>
  );
}
