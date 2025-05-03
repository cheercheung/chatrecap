"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";

export default function QuoteCards({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-20 relative overflow-hidden">

      <div className="container relative z-10">
        <div className="text-center mb-12">
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
          {section.title && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500"
            >
              {section.title}
            </motion.h2>
          )}
          {section.description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              {section.description}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {section.items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
