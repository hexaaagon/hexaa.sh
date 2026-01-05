"use client";

import { JakartaTransportMap } from "@/components/jakarta-transport-map";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPreviousLine, getNextLine } from "@/lib/jakarta-lines";
import type { ReactNode } from "react";

type JakartaTransportMapClientProps = {
  contentMap: Record<string, ReactNode>;
};

export function JakartaTransportMapClient({
  contentMap,
}: JakartaTransportMapClientProps) {
  const [line, setLine] = useQueryState("line", { defaultValue: "" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Hide footer on mount, restore on unmount
    const footer = document.querySelector("footer");
    const originalDisplay = footer?.style.display;
    if (footer) {
      footer.style.display = "none";
    }

    return () => {
      if (footer && originalDisplay !== undefined) {
        footer.style.display = originalDisplay;
      }
    };
  }, []);

  const currentLine = line || "";
  const content = contentMap[currentLine];
  const previousLine = getPreviousLine(currentLine);
  const nextLine = getNextLine(currentLine);

  const handlePrevious = () => {
    if (previousLine) {
      setLine(previousLine.slug);
    } else {
      setLine("");
    }
  };

  const handleNext = () => {
    if (nextLine) {
      setLine(nextLine.slug);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <main className="-mt-16 relative">
          {/* Map Section */}
          <div className="relative w-full bg-muted" style={{ height: "50vh" }}>
            {isMounted && (
              <div
                className="absolute inset-0"
                style={{ height: "50vh", width: "100%" }}
              >
                <JakartaTransportMap adjustCenter={false} isMobile={true} />
              </div>
            )}

            {/* Navigation Buttons - Floating on map (bottom-left) */}
            <div className="absolute bottom-4 left-4" style={{ zIndex: 1000 }}>
              <ButtonGroup orientation="horizontal">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={!previousLine && currentLine === ""}
                  className="bg-background/95 backdrop-blur"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={!nextLine}
                  className="bg-background/95 backdrop-blur"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Blog Content Section */}
          <div className="rounded-t-xl bg-background p-6 pt-12">{content}</div>
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="fixed inset-0 flex gap-2 p-4">
          {/* Map Section - Full screen behind everything */}
          <div className="absolute inset-0 z-0">
            <JakartaTransportMap adjustCenter={true} isMobile={false} />
          </div>

          {/* Blog Panel - Floating on left side with margin-top for navbar */}
          <aside
            className="relative z-50 flex h-full w-full max-w-[30rem] overflow-y-auto rounded-xl border bg-background shadow-2xl"
            style={{
              marginTop: "calc(var(--navbar-height))",
              height: "calc(100% - var(--navbar-height) - 1rem)",
            }}
            data-lenis-prevent
          >
            <div className="p-6" style={{ scrollBehavior: "auto" }}>
              {content}
            </div>
          </aside>
          {/* Navigation Buttons - Floating on map (to the right of sidebar) */}
          <div
            className="mt-auto mb-4"
            style={{ left: "calc(max(28rem, theme(maxWidth.md)) + 2rem)" }}
          >
            <ButtonGroup orientation="vertical">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={!previousLine && currentLine === ""}
                className="bg-background/95 backdrop-blur"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={!nextLine}
                className="bg-background/95 backdrop-blur"
              >
                <ChevronRight className="size-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </>
  );
}
