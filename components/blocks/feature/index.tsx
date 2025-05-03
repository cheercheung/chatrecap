"use client";

import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import { ShineBorder } from "@/components/ui/shine-border";
import { motion } from "framer-motion";

export default function Feature({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-20 relative overflow-hidden">

      <div className="container relative z-10">
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-2 mb-12">
          {section.label && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-medium text-primary mb-2 uppercase tracking-wider"
            >
              {section.label}
            </motion.span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-4 text-pretty text-3xl font-bold lg:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500"
          >
            {section.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg text-center"
          >
            {section.description}
          </motion.p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {section.items?.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative flex flex-col p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-colors duration-300"
            >
              <ShineBorder
                borderWidth={1}
                duration={10}
                shineColor={["hsl(var(--primary))", "hsl(var(--primary))"]}
                className="rounded-xl opacity-70"
              />
              {item.icon && (
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Icon name={item.icon} className="size-8 text-primary" />
                </div>
              )}
              <h3 className="mb-2 text-xl font-semibold text-primary">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
