"use client";

import { Section as SectionType } from "@/types/blocks/section";
import AnimateOnScroll from "@/components/ui/animate-on-scroll";

export default function QuoteCards({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-20 relative overflow-hidden">

      <div className="container relative z-10">
        <div className="text-center mb-12">
          {section.label && (
            <AnimateOnScroll
              animation="fade-in-up"
              duration="duration-500"
              className="inline-block text-sm font-medium text-primary mb-2 uppercase tracking-wider"
            >
              {section.label}
            </AnimateOnScroll>
          )}
          {section.title && (
            <AnimateOnScroll
              animation="fade-in-up"
              delay="delay-100"
              duration="duration-500"
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500"
            >
              {section.title}
            </AnimateOnScroll>
          )}
          {section.description && (
            <AnimateOnScroll
              animation="fade-in-up"
              delay="delay-200"
              duration="duration-500"
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              {section.description}
            </AnimateOnScroll>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {section.items?.map((item, index) => (
            <AnimateOnScroll
              key={index}
              animation="fade-in-up"
              delay={index % 2 === 0 ? "delay-100" : "delay-200"}
              duration="duration-500"
              className="relative p-8 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              {/* 引号装饰 */}
              <div className="absolute top-4 left-4 text-4xl text-primary/20 font-serif">"</div>
              <div className="absolute bottom-4 right-4 text-4xl text-primary/20 font-serif">"</div>

              <div className="relative z-10">
                <div className="mb-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {section.scenario_label} {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>

                {/* 波浪线装饰 */}
                <div className="mt-4 w-16 h-1 bg-gradient-to-r from-primary/50 to-pink-500/50 rounded-full"></div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
