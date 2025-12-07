import { Suspense } from "react";
import { Index } from "@/labs-registry/__index__";
import { cn } from "@/lib/utils";

export type ComponentPreviewProps = React.ComponentProps<"div"> & {
  name: string;
  align?: "center" | "start" | "end";
} & (
    | {
        type: "component";
      }
    | {
        type: "showcase";
        showcaseUrl: `/labs-showcase/${string}`;
        showcaseClassName?: string;
      }
  );

export function ComponentPreview({
  name,
  className,
  align = "center",
  ...props
}: ComponentPreviewProps) {
  if (props.type === "component") {
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
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-2xl border border-border bg-[linear-gradient(to_right,#8080801c_1px,transparent_1px),linear-gradient(to_bottom,#8080801c_1px,transparent_1px)] bg-position-[center_center] bg-primary-foreground/80 bg-size-[40px_40px] px-2 py-28 shadow-inner transition-[background-size] duration-300 sm:bg-size-[50px_50px] lg:bg-size-[60px_60px]",
          className,
        )}
        data-align={align}
        {...props}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      </div>
    );
  } else if (props.type === "showcase") {
    const { showcaseUrl: _1, showcaseClassName: _2, ...parentProps } = props;

    return (
      <div className={className} data-align={align} {...parentProps}>
        <Suspense fallback={<div>Loading...</div>}>
          <iframe
            src={props.showcaseUrl}
            className={cn(
              "h-[500px] w-full rounded-2xl border border-border bg-primary-foreground/80",
              props.showcaseClassName,
            )}
            title={`Showcase: ${name}`}
            data-lenis-prevent
          />
        </Suspense>
      </div>
    );
  }
}
