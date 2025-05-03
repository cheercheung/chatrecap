"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function FeatureItem({
  title,
  description,
  icon: Icon,
  className,
}: FeatureItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4 backdrop-blur-sm shadow-sm",
        className
      )}
    >
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
