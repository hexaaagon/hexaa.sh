import { TerminalSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { CodeBlock } from "@/components/code-block";

export function ShadcnInstall({ path }: { path: string }) {
  const url = `${process.env.BETTER_AUTH_URL || "https://hexaa.sh"}/labs/r/${path}.json`;
  const tabs = [
    { name: "npm", value: "npm" },
    { name: "yarn", value: "yarn" },
    { name: "pnpm", value: "pnpm" },
    { name: "bun", value: "bun" },
  ];

  return (
    <Tabs defaultValue="npm" persist>
      <TabsList className="not-prose">
        <TerminalSquare className="my-auto inline" size={16} />
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-medium text-fd-muted-foreground transition-colors data-[state=active]:text-fd-primary"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="npm">
        <CodeBlock
          code={`npx shadcn@latest add ${url}`}
          lang="bash"
          wrapper={{ className: "rounded-md border" }}
        />
      </TabsContent>
      <TabsContent value="yarn">
        <CodeBlock
          code={`yarn dlx shadcn@latest add ${url}`}
          lang="bash"
          wrapper={{ className: "rounded-md border" }}
        />
      </TabsContent>
      <TabsContent value="pnpm">
        <CodeBlock
          code={`pnpx shadcn@latest add ${url}`}
          lang="bash"
          wrapper={{ className: "rounded-md border" }}
        />
      </TabsContent>
      <TabsContent value="bun">
        <CodeBlock
          code={`bunx shadcn@latest add ${url}`}
          lang="bash"
          wrapper={{ className: "rounded-md border" }}
        />
      </TabsContent>
    </Tabs>
  );
}
