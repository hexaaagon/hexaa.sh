import { blog as source } from "@/lib/source";
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
        <div className="flex min-h-min w-screen flex-1 flex-col items-start px-0 xl:flex-row">
          <div className="hidden w-[320px] 2xl:block" />
          {children}
        </div>
      </DocsLayout>
    </RootProvider>
  );
}
