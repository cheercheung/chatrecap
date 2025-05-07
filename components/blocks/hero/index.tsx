import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import OptimizedImage from "@/components/ui/optimized-image";
import ImageCard from "@/components/ui/image-card";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import Link from "next/link";

// Hero 组件，优化性能，移除所有动画和效果
export default async function Hero({ hero }: { hero: HeroType }) {
  // 动态导入 i18n 数据
  let imageData = [];
  // 控制显示的图片数量
  const maxImages = 4; // 设置最大显示4张图片

  try {
    // 获取当前语言的图片数据
    const locale = typeof window !== 'undefined' ? document.documentElement.lang || 'en' : 'en';
    const module = await import(`@/i18n/pages/landing/${locale}.json`);

    if (module.default && module.default.image) {
      // 将对象转换为数组
      const imgObj = module.default.image;
      const itemKeys = Object.keys(imgObj).filter(key => key.startsWith('item')).slice(0, maxImages);

      // 只获取指定数量的图片
      imageData = itemKeys.map(key => ({
        src: imgObj[key].src || '',
        alt: imgObj[key].alt || '',
        title: imgObj[key].title || '',
        description: imgObj[key].description || ''
      }));

      // 如果没有足够的图片，使用默认数据填充
      if (imageData.length === 0) {
        imageData = [
          { src: '', alt: '聊天截图示例1', title: imgObj.title || '聊天分析示例', description: imgObj.description || '' }
        ];
      }
    }
  } catch (error) {
    console.error('Failed to load image data from i18n:', error);
    // 使用默认数据
    imageData = [
      { src: '', alt: '聊天截图示例1', title: '聊天分析示例', description: '上传您的聊天记录，获取深入的关系洞察和沟通模式分析。' }
    ];
  }

  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      <section className="py-10 pt-6 relative">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* 左侧内容: 标题、描述、按钮和快乐用户 */}
            <div className="flex flex-col">
              <div className="text-left">
                {texts && texts.length > 1 ? (
                  <h1 className="mb-4 mt-3 text-4xl font-bold lg:mb-6 lg:text-6xl max-w-3xl">
                    {texts[0]}
                    <span className="text-primary px-2">
                      {highlightText}
                    </span>
                    {texts[1]}
                  </h1>
                ) : (
                  <h1 className="mb-4 mt-3 text-4xl font-bold lg:mb-6 lg:text-6xl max-w-3xl">
                    {hero.title}
                  </h1>
                )}

                <p
                  className="text-muted-foreground lg:text-xl leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                />

                {hero.tip && (
                  <p className="mt-6 text-md text-muted-foreground font-medium">
                    {hero.tip}
                  </p>
                )}

                {hero.show_happy_users && (
                  <div className="mt-6">
                    <HappyUsers />
                  </div>
                )}

                {hero.buttons && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    {hero.buttons.map((item, i) => {
                      return (
                        <Link
                          key={i}
                          href={item.url || ""}
                          target={item.target || ""}
                          className="flex items-center"
                          prefetch={false} // 禁用预取，减少不必要的网络请求
                        >
                          <Button
                            className="w-full"
                            size="lg"
                            variant={item.variant || "default"}
                          >
                            {item.title}
                            {item.icon && (
                              <Icon name={item.icon} className="ml-2" />
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 右侧内容: 徽章、公告和图片 */}
            <div className="flex flex-col h-full">
              {hero.show_badge && (
                <div className="flex justify-center items-center mb-4">
                  <OptimizedImage
                    src="/imgs/badges/phdaily.svg"
                    alt="phdaily"
                    width={120}
                    height={40}
                    className="h-10"
                    priority={true}
                  />
                </div>
              )}

              {hero.announcement && (
                <div className="flex justify-center mb-3">
                  <a
                    href={hero.announcement.url}
                    className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm"
                  >
                    {hero.announcement.label && (
                      <Badge className="bg-primary/80">{hero.announcement.label}</Badge>
                    )}
                    {hero.announcement.title}
                  </a>
                </div>
              )}

              <ImageCard
                images={imageData.map(item => ({
                  src: item.src,
                  alt: item.alt
                }))}
                title={imageData[0]?.title || "聊天分析示例"}
                description={imageData[0]?.description || "上传您的聊天记录，获取深入的关系洞察和沟通模式分析。"}
                className="min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
