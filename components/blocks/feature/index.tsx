"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-2 mb-12">
          {section.label && (
            <span className="inline-block text-sm font-medium text-primary mb-2 uppercase tracking-wider">
              {section.label}
            </span>
          )}
          <h2 className="mb-4 text-pretty text-3xl font-bold lg:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg text-center">
            {section.description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, i) => (
            <div
              key={i}
              className="relative flex flex-col p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10"
            >
              {item.icon && (
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Icon name={item.icon} className="size-8 text-primary" />
                </div>
              )}
              <h3 className="mb-2 text-xl font-semibold text-primary">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
