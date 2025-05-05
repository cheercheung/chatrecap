import Footer from "@/components/blocks/footer";
import Header from "@/components/blocks/header";
import GlobalBg from "@/components/global-bg";
import WebVitalsReporter from "@/components/web-vitals-reporter";
import AnimationInitializer from "@/components/animation-initializer";
import { ReactNode } from "react";
import { getLandingPage } from "@/services/page";

export default async function DefaultLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);

  return (
    <>
      <GlobalBg />
      {page.header && <Header header={page.header} />}
      <main className="overflow-x-hidden">{children}</main>
      {page.footer && <Footer footer={page.footer} />}
      <WebVitalsReporter />
      <AnimationInitializer />
    </>
  );
}
