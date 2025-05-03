"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart, Star } from "lucide-react";

export default function HappyUsers() {
  return (
    <div className="w-fit flex flex-col sm:flex-row items-start gap-4 bg-primary/5 backdrop-blur-sm p-4 rounded-2xl border border-primary/20 shadow-sm">
      <span className="inline-flex items-center -space-x-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Avatar
            className="size-12 border-2 border-background shadow-md transition-transform hover:scale-105 hover:z-10"
            key={index}
            style={{
              zIndex: 5 - index,
              transform: `translateX(${index * 2}px)`,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <AvatarImage
              src={`/imgs/users/${index + 6}.png`}
              alt="placeholder"
              className="object-cover"
            />
          </Avatar>
        ))}
      </span>
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Star
              key={index}
              className="size-5 fill-pink-400 text-pink-400"
            />
          ))}
          <Heart
            className="size-5 fill-primary text-primary animate-pulse"
          />
        </div>
        <p className="text-left font-medium text-muted-foreground">
          from 99+ happy users
        </p>
      </div>
    </div>
  );
}
