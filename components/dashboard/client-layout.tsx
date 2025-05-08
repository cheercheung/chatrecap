"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { Sidebar as SidebarType } from "@/types/blocks/sidebar";

/**
 * 客户端版本的仪表盘布局组件
 * 
 * 用于客户端组件中使用
 */
export default function DashboardClientLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: SidebarType;
}) {
  return (
    <SidebarProvider>
      {sidebar && <Sidebar sidebar={sidebar} />}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
