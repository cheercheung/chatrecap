import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

export default function HappyUsers() {
  // Use hardcoded text for now
  const translatedText = '99+ happy users';

  return (
    <div className="w-fit flex flex-col sm:flex-row items-start gap-4 bg-card p-4 rounded-2xl border border-primary/20">
      <span className="inline-flex items-center -space-x-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Avatar
            className="size-12 border-2 border-background"
            key={index}
            style={{
              zIndex: 5 - index,
              transform: `translateX(${index * 2}px)`
            }}
          >
            <AvatarImage
              src={`/imgs/users/${index + 3}.png`}
              alt="placeholder"
              className="object-cover"
            />
          </Avatar>
        ))}
      </span>
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Heart
              key={index}
              className="size-5 fill-pink-400 text-pink-400"
            />
          ))}
        </div>
        <p className="text-left font-medium text-muted-foreground">
          <span className="din-numbers">99+</span> happy users
        </p>
      </div>
    </div>
  );
}
