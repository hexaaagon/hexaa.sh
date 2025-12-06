import { Suspense } from "react";
import { Index } from "@/labs-registry/__index__";

export function ComponentPreview({
  name,
  className,
  align = "center",
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  align?: "center" | "start" | "end";
}) {
  const entry = Index[name as keyof typeof Index];

  if (!entry) {
    return (
      <p className="mt-6 text-muted-foreground text-sm">
        Component{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    );
  }

  const Component = entry.component;

  return (
    <div className={className} data-align={align} {...props}>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </div>
  );
}
