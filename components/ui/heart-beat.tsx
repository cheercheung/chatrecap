"use client";

import React, { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface HeartBeatProps extends ComponentPropsWithoutRef<"div"> {
  heartSize?: number;
  heartOpacity?: number;
  pulseCount?: number;
  color?: string;
  floatingHearts?: number;
}

export const HeartBeat = React.memo(function HeartBeat({
  heartSize = 80,
  heartOpacity = 0.7,
  pulseCount = 3,
  color = "primary",
  floatingHearts = 5,
  className,
  ...props
}: HeartBeatProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* 中心心形 */}
      <div
        className="absolute animate-heartbeat"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${heartSize}px`,
          height: `${heartSize}px`,
          opacity: heartOpacity,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill={`hsl(var(--${color}))`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* 脉冲环 */}
      {Array.from({ length: pulseCount }, (_, i) => {
        const size = heartSize + i * 40;
        const opacity = heartOpacity - i * 0.2;
        const animationDelay = `${i * 0.3}s`;

        return (
          <div
            key={i}
            className="absolute animate-heartbeat-pulse rounded-full"
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                border: `1px solid hsl(var(--${color}))`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}

      {/* 漂浮的小心形 */}
      {Array.from({ length: floatingHearts }, (_, i) => {
        const size = heartSize * 0.2 + i * 5;
        const top = 40 + Math.random() * 20;
        const left = 40 + Math.random() * 20;
        const animationDuration = 3 + Math.random() * 2;
        const animationDelay = Math.random() * 2;

        return (
          <div
            key={`float-${i}`}
            className="absolute animate-float-heart"
            style={
              {
                "--duration": `${animationDuration}s`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: 0.4,
                animationDelay: `${animationDelay}s`,
                top: `${top}%`,
                left: `${left}%`,
              } as CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill={`hsl(var(--${color}))`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
});

HeartBeat.displayName = "HeartBeat";
