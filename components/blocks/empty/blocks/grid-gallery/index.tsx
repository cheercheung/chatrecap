"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function GridGallery({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {section.items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-primary/10">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image.src} 
                      alt={item.title || ""} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
