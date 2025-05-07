"use client";

import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import Link from "next/link";
import { Section as SectionType } from "@/types/blocks/section";

export default function CTA({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="px-8">
        <div className='relative flex items-center justify-center rounded-2xl bg-primary/5 backdrop-blur-sm px-8 py-16 text-center md:p-20 overflow-hidden border border-primary/10 shadow-lg'>
          <div className="mx-auto max-w-screen-md relative z-10">
            <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
              {section.title}
            </h2>
            <p className="text-muted-foreground md:text-lg">
              {section.description}
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                variant="default"
                className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary hover:to-pink-600 shadow-lg px-10 py-7 text-lg font-medium rounded-full"
              >
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2"
                >
                  {section.buttons && section.buttons.length > 0 ? section.buttons[0].title : "Go Recap"}
                  <Icon name="RiArrowRightLine" className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
