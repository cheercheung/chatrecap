"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlatformOption {
  id: string;
  label: string;
}

interface PlatformFilterProps {
  options: PlatformOption[];
  defaultSelected?: string;
  onChange?: (selectedPlatform: string) => void;
}

export default function PlatformFilter({
  options,
  defaultSelected,
  onChange
}: PlatformFilterProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(defaultSelected || options[0]?.id || "");

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId);
    if (onChange) {
      onChange(platformId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-pink-50/50 dark:bg-pink-950/10 rounded-lg p-4 flex flex-wrap justify-center gap-6"
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center">
          <label
            htmlFor={`platform-${option.id}`}
            className="flex items-center cursor-pointer"
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 transition-all",
                selectedPlatform === option.id
                  ? "border-primary bg-primary/10 scale-110"
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              {selectedPlatform === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                />
              )}
            </div>
            <input
              type="radio"
              id={`platform-${option.id}`}
              name="platform"
              value={option.id}
              checked={selectedPlatform === option.id}
              onChange={() => handlePlatformChange(option.id)}
              className="sr-only"
            />
            <span className={cn(
              "text-sm font-medium transition-colors",
              selectedPlatform === option.id
                ? "text-primary"
                : "text-gray-700 dark:text-gray-300"
            )}>
              {option.label}
            </span>
          </label>
        </div>
      ))}
    </motion.div>
  );
}
