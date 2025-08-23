"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { sendGAEvent } from "@next/third-parties/google";

export default function ThemeSwitch({
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "variant">) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className={cn("h-8 w-16 rounded-full px-6", className)} />;
  }

  return (
    <Button
      className="h-8 rounded-full shadow-xl has-[>svg]:px-6"
      size="sm"
      variant="outline"
      onClick={(e) => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        sendGAEvent("event", "buttonClicked", {
          value: "theme-switch",
        });
        onClick?.(e);
      }}
      {...props}
    >
      {resolvedTheme === "dark" ? (
        <>
          <Moon size={13.5} suppressHydrationWarning />
          <span className="sr-only">Switch to light mode</span>
        </>
      ) : (
        <>
          <Sun size={13.5} suppressHydrationWarning />
          <span className="sr-only">Switch to dark mode</span>
        </>
      )}
    </Button>
  );
}
