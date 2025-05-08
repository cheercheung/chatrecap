/**
 * 静态版本的 HappyUsers 组件
 * 使用 Next.js Image 组件优化图像加载
 */
import { Avatar } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function StaticHappyUsers() {
  // 使用硬编码文本
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
            <div className="relative w-full h-full">
              <Image
                src={`/imgs/users/${index + 6}.png`}
                alt="happy user"
                fill
                sizes="48px"
                className="object-cover"
                priority={index < 2} // 只优先加载前两个头像
              />
            </div>
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
          {translatedText}
        </p>
      </div>
    </div>
  );
}
