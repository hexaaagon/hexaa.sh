import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function PlusSeparator({
  position,
  main = {},
  child,
}: {
  position: Array<"top-left" | "top-right" | "bottom-left" | "bottom-right">;
  main?: React.ComponentProps<typeof Plus>;
  child?: {
    "top-left"?: React.ComponentProps<typeof Plus>;
    "top-right"?: React.ComponentProps<typeof Plus>;
    "bottom-left"?: React.ComponentProps<typeof Plus>;
    "bottom-right"?: React.ComponentProps<typeof Plus>;
  };
}) {
  const { className, size, ...props } = main;

  const {
    className: tlClassName,
    size: tlSize,
    ...tlChild
  } = child?.["bottom-left"] || {};
  const {
    className: trClassName,
    size: trSize,
    ...trChild
  } = child?.["bottom-right"] || {};
  const {
    className: blClassName,
    size: blSize,
    ...blChild
  } = child?.["top-left"] || {};
  const {
    className: brClassName,
    size: brSize,
    ...brChild
  } = child?.["top-right"] || {};

  return (
    <>
      {position.includes("top-left") && (
        <Plus
          size={tlSize || size || 8}
          className={cn(
            "-top-1 -left-1 absolute text-separator",
            className,
            tlClassName,
          )}
          {...props}
          {...tlChild}
        />
      )}
      {position.includes("top-right") && (
        <Plus
          size={trSize || size || 8}
          className={cn(
            "-top-1 -right-1 absolute text-separator",
            className,
            trClassName,
          )}
          {...props}
          {...trChild}
        />
      )}
      {position.includes("bottom-left") && (
        <Plus
          size={blSize || size || 8}
          className={cn(
            "-bottom-1 -left-1 absolute text-separator",
            className,
            blClassName,
          )}
          {...props}
          {...blChild}
        />
      )}
      {position.includes("bottom-right") && (
        <Plus
          size={brSize || size || 8}
          className={cn(
            "-bottom-1 -right-1 absolute text-separator",
            className,
            brClassName,
          )}
          {...props}
          {...brChild}
        />
      )}
    </>
  );
}
