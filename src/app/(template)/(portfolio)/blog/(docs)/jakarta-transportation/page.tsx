"use client";

import { JakartaTransportMap } from "@/components/jakarta-transport-map";
import { useQueryState } from "nuqs";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPreviousLine, getNextLine } from "@/lib/jakarta-lines";

// MDX content imports
import IndexContent from "@/content/blog/jakarta-transportation/index.mdx";
import KrlRangkasbitung from "@/content/blog/jakarta-transportation/krl-rangkasbitung.mdx";
import KrlCikarangLoop from "@/content/blog/jakarta-transportation/krl-cikarang-loop.mdx";
import KrlBogor from "@/content/blog/jakarta-transportation/krl-bogor.mdx";
import KrlTangerang from "@/content/blog/jakarta-transportation/krl-tangerang.mdx";
import KrlTanjungPriok from "@/content/blog/jakarta-transportation/krl-tanjung-priok.mdx";
import MrtNorthSouth1 from "@/content/blog/jakarta-transportation/mrt-north-south-1.mdx";
import MrtNorthSouth2a from "@/content/blog/jakarta-transportation/mrt-north-south-2a.mdx";
import MrtNorthSouth2b from "@/content/blog/jakarta-transportation/mrt-north-south-2b.mdx";
import MrtEastWest3 from "@/content/blog/jakarta-transportation/mrt-east-west-3.mdx";

const contentMap: Record<string, React.ComponentType> = {
  "": IndexContent,
  "krl-rangkasbitung": KrlRangkasbitung,
  "krl-cikarang-loop": KrlCikarangLoop,
  "krl-bogor": KrlBogor,
  "krl-tangerang": KrlTangerang,
  "krl-tanjung-priok": KrlTanjungPriok,
  "mrt-north-south-1": MrtNorthSouth1,
  "mrt-north-south-2a": MrtNorthSouth2a,
  "mrt-north-south-2b": MrtNorthSouth2b,
  "mrt-east-west-3": MrtEastWest3,
};

function JakartaTransportMapContent() {
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
  const Content = contentMap[currentLine] || IndexContent;
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
          <div className="rounded-t-xl bg-background p-6 pt-12">
            <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
              <Content />
            </article>
          </div>
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
              <article className="prose prose-neutral prose-sm dark:prose-invert pb-8">
                <Content />
              </article>
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

export default function JakartaTransportMapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <JakartaTransportMapContent />
    </Suspense>
  );
}
