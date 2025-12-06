import { DocsSidebar } from "@/components/labs-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { labs as source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout
        sidebar={{
          enabled: false,
        }}
        nav={{
          enabled: false,
        }}
        tree={source.pageTree}
      >
        <SidebarProvider className="flex min-h-min w-screen flex-1 flex-col items-start px-0 [--sidebar-width:220px] [--top-spacing:65px] xl:flex-row">
          <DocsSidebar tree={source.pageTree} />
          {children}
        </SidebarProvider>
      </DocsLayout>
    </RootProvider>
  );
}
