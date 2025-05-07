"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-semibold">AI analyzing...</h3>
          <p className="text-muted-foreground text-center">
            We are analyzing your chat with AI for deeper insights
          </p>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: "50%" }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">please wait</p>
        </div>
      </div>
    </div>
  );
}
