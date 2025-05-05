"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";
import ViewportAnimation from "@/components/ui/viewport-animation";
import OptimizedImage from "@/components/ui/optimized-image";

export default function GridGallery({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
        <ViewportAnimation type="fadeInUp" duration={0.6}>
          <div className="text-center mb-10">
            {section.label && (
              <span className="inline-block text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                {section.label}
              </span>
            )}
            {section.title && (
              <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="max-w-2xl mx-auto text-muted-foreground">
                {section.description}
              </p>
            )}
          </div>
        </ViewportAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {section.items?.map((item, index) => (
            <ViewportAnimation
              key={index}
              type="fadeInUp"
              delay={index * 0.1}
              duration={0.5}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-primary/10">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <OptimizedImage
                      src={item.image.src}
                      alt={item.title || ""}
                      width={400}
                      height={300}
                      className="w-full h-full"
                      objectFit="cover"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            </ViewportAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
