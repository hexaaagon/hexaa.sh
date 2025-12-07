"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useScroll } from "@/labs-registry/components-v1/functions/hooks/use-scroll";
import {
  clamp,
  mapRange,
} from "@/labs-registry/components-v1/functions/lib/maths";

export interface OverlapCard {
  title?: string;
  description: string | React.ReactNode;
  number?: number;
}

export interface OverlapCardsProps {
  cards: OverlapCard[];
  className?: string;
  // Header customization
  header?: {
    title: string;
    subtitle: string;
  };
  // Scroll behavior
  desktopScroll?: Partial<ScrollBehavior>;
  mobileScroll?: Partial<ScrollBehavior>;
  // Visual effects
  parallaxRatio?: number;
  showBackground?: boolean;
  backgroundPattern?: "grid" | "dots" | "none";
  // Card appearance
  desktopCardDimensions?: Partial<CardDimensions>;
  mobileCardDimensions?: Partial<CardDimensions>;
  transitionDuration?: number;
  cardClassName?: string;
  cardStyle?: "default" | "lenis";
  // Container styling
  containerClassName?: string;
}

export interface CardDimensions {
  width: number;
  height: number;
}

export interface ScrollBehavior {
  scrollPerCard: number;
  baseScroll: number;
  endScroll: number;
}

export function OverlapCards({
  cards,
  className,
  header,
  desktopScroll = {},
  mobileScroll = {},
  parallaxRatio = 0.1,
  showBackground = true,
  backgroundPattern = "grid",
  desktopCardDimensions = {},
  mobileCardDimensions = {},
  transitionDuration = 1000,
  cardClassName,
  cardStyle = "lenis",
  containerClassName,
}: OverlapCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ top: 0, height: 0 });
  const [current, setCurrent] = useState(0);
  const [backgroundHeight, setBackgroundHeight] = useState("200vh");
  const [scrollHeight, setScrollHeight] = useState("100vh");
  const [endScrollVh, setEndScrollVh] = useState(0);

  // Validate parallax ratio (between 0 and 1)
  const validatedParallaxRatio = Math.max(0, Math.min(1, parallaxRatio));

  // Default values for scroll behavior
  const defaultDesktopScroll: ScrollBehavior = {
    scrollPerCard: 60,
    baseScroll: 80,
    endScroll: 100,
  };
  const defaultMobileScroll: ScrollBehavior = {
    scrollPerCard: 120,
    baseScroll: 200,
    endScroll: 150,
  };

  // Default values for card dimensions
  const defaultDesktopDimensions: CardDimensions = { width: 480, height: 320 };
  const defaultMobileDimensions: CardDimensions = { width: 280, height: 200 };

  // Validation helpers
  const validateScrollBehavior = useCallback(
    (
      config: Partial<ScrollBehavior>,
      defaults: ScrollBehavior,
    ): ScrollBehavior => {
      return {
        scrollPerCard: Math.max(
          10,
          config.scrollPerCard ?? defaults.scrollPerCard,
        ),
        baseScroll: Math.max(0, config.baseScroll ?? defaults.baseScroll),
        endScroll: Math.max(0, config.endScroll ?? defaults.endScroll),
      };
    },
    [],
  );

  const validateDimensions = useCallback(
    (
      dimensions: Partial<CardDimensions>,
      defaults: CardDimensions,
      isDesktop: boolean,
    ): CardDimensions => {
      const minWidth = isDesktop ? 200 : 150;
      const minHeight = isDesktop ? 150 : 100;
      const maxWidth = isDesktop
        ? typeof window !== "undefined"
          ? window.innerWidth * 0.8
          : 800
        : 400;
      const maxHeight = isDesktop
        ? typeof window !== "undefined"
          ? window.innerHeight * 0.6
          : 600
        : 300;

      return {
        width: Math.min(
          maxWidth,
          Math.max(minWidth, dimensions.width ?? defaults.width),
        ),
        height: Math.min(
          maxHeight,
          Math.max(minHeight, dimensions.height ?? defaults.height),
        ),
      };
    },
    [],
  );

  const desktopScrollConfig = useMemo(
    () => validateScrollBehavior(desktopScroll, defaultDesktopScroll),
    [desktopScroll, validateScrollBehavior],
  );
  const mobileScrollConfig = useMemo(
    () => validateScrollBehavior(mobileScroll, defaultMobileScroll),
    [mobileScroll, validateScrollBehavior],
  );
  const desktopDimensions = useMemo(
    () =>
      validateDimensions(desktopCardDimensions, defaultDesktopDimensions, true),
    [desktopCardDimensions, validateDimensions],
  );
  const mobileDimensions = useMemo(
    () =>
      validateDimensions(mobileCardDimensions, defaultMobileDimensions, false),
    [mobileCardDimensions, validateDimensions],
  );

  // Get background pattern classes
  const getBackgroundPattern = () => {
    if (!showBackground || backgroundPattern === "none") return "";
    if (backgroundPattern === "dots") {
      return "bg-[radial-gradient(#80808033_1px,transparent_1px)] bg-size-[20px_20px]";
    }
    return "bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-size-[70px_70px]";
  };

  // Calculate scroll height based on cards count and device
  useEffect(() => {
    const calculateScrollHeight = () => {
      const isDesktop = window.innerWidth >= 768;
      // Use custom scroll values or defaults
      const scrollPerCard = isDesktop
        ? desktopScrollConfig.scrollPerCard
        : mobileScrollConfig.scrollPerCard;
      const baseScroll = isDesktop
        ? desktopScrollConfig.baseScroll
        : mobileScrollConfig.baseScroll;
      const endScroll = isDesktop
        ? desktopScrollConfig.endScroll
        : mobileScrollConfig.endScroll;

      setEndScrollVh(endScroll);
      const totalScroll = baseScroll + cards.length * scrollPerCard + endScroll;
      setScrollHeight(`${totalScroll}vh`);
    };

    calculateScrollHeight();
    window.addEventListener("resize", calculateScrollHeight);
    return () => window.removeEventListener("resize", calculateScrollHeight);
  }, [cards.length, desktopScrollConfig, mobileScrollConfig]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        const boundingRect = containerRef.current.getBoundingClientRect();
        const height = containerRef.current.scrollHeight;
        setRect({
          top: boundingRect.top + window.scrollY,
          height: height,
        });

        // Calculate background height based on container height and parallax ratio
        const extraHeight = height * validatedParallaxRatio;
        const totalHeight = window.innerHeight + extraHeight;
        setBackgroundHeight(`${totalHeight}px`);
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [scrollHeight]); // Re-run when scrollHeight changes

  useScroll(
    ({ scroll }) => {
      const windowHeight = window.innerHeight;
      const start = rect.top - windowHeight * 2;
      // Subtract endScroll from height so progress reaches 100% before the end padding
      const endScrollPixels = (endScrollVh / 100) * windowHeight;
      const end = rect.top + rect.height - windowHeight - endScrollPixels;

      const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1);

      if (cardsContainerRef.current) {
        const clampedProgress = clamp(
          0,
          mapRange(rect.top, end, scroll, 0, 1),
          1,
        );
        cardsContainerRef.current.style.setProperty(
          "--progress",
          clampedProgress.toString(),
        );
      }

      if (backgroundRef.current && containerRef.current) {
        const containerTop = rect.top;
        const relativeScroll = scroll - containerTop;
        const parallaxOffset = relativeScroll * -validatedParallaxRatio;
        backgroundRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }

      const step = Math.floor(progress * cards.length);
      setCurrent(step);
    },
    [rect, cards.length],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative", className, containerClassName)}
      style={{ minHeight: scrollHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden p-4 md:p-8">
        {/* Parallax Background */}
        {showBackground && (
          <div
            ref={backgroundRef}
            className={cn(
              "pointer-events-none absolute inset-0 bg-position-[center_center] will-change-transform",
              getBackgroundPattern(),
            )}
            style={{ height: backgroundHeight }}
          >
            <div className="-top-8 absolute right-0 left-0 h-[15vh] w-full bg-linear-to-b from-primary-foreground to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 h-[30vh] w-full bg-linear-to-t from-primary-foreground to-transparent" />
          </div>
        )}
        <div className="relative h-full">
          {header && (
            <aside className="mb-8 text-right md:absolute md:top-0 md:right-0">
              <h2 className="font-bold text-xl sm:text-4xl xl:text-5xl 2xl:text-6xl">
                {header.title}
                <br />
                <span className="text-foreground/70">{header.subtitle}</span>
              </h2>
            </aside>
          )}

          <div
            ref={cardsContainerRef}
            className="relative h-full pt-24 md:pt-0"
          >
            {cards.map((card, index) => (
              <SingleCard
                // biome-ignore lint/suspicious/noArrayIndexKey: false positive
                key={index}
                index={index}
                title={card.title}
                description={card.description}
                number={card.number || index + 1}
                current={index <= current - 1}
                totalCards={cards.length}
                desktopDimensions={desktopDimensions}
                mobileDimensions={mobileDimensions}
                transitionDuration={transitionDuration}
                cardClassName={cardClassName}
                cardStyle={cardStyle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SingleCardProps {
  title?: string;
  description?: string | React.ReactNode;
  number: number;
  index: number;
  current: boolean;
  totalCards: number;
  desktopDimensions: CardDimensions;
  mobileDimensions: CardDimensions;
  transitionDuration: number;
  cardClassName?: string;
  cardStyle: "default" | "lenis";
}

function SingleCard({
  title,
  description,
  index,
  current,
  totalCards,
  desktopDimensions,
  mobileDimensions,
  transitionDuration,
  cardClassName,
  cardStyle,
}: SingleCardProps) {
  const [position, setPosition] = useState({ top: "0px", left: "0" });
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const getCardPosition = () => {
      // Calculate available space (screen height/width minus card size and padding)
      const cardHeight = isDesktop
        ? desktopDimensions.height
        : mobileDimensions.height;
      const cardWidth = isDesktop
        ? desktopDimensions.width
        : mobileDimensions.width;
      const padding = isDesktop ? 64 : 32; // Account for container padding

      // On mobile, use a percentage-based approach to distribute cards more evenly
      let availableHeight = isDesktop
        ? window.innerHeight - cardHeight - padding * 2
        : window.innerHeight * 0.4;
      let availableWidth = window.innerWidth - cardWidth - padding * 2;

      // Auto-adjust if cards don't fit: ensure minimum spacing
      if (availableHeight < 0) {
        availableHeight = Math.max(50, window.innerHeight * 0.3);
      }
      if (availableWidth < 0) {
        availableWidth = Math.max(20, window.innerWidth * 0.1);
      }

      // Calculate consistent diagonal spacing for bottom-right direction
      const minSpacing = isDesktop ? 40 : 20;
      let spacingTop = totalCards > 1 ? availableHeight / (totalCards - 1) : 0;
      let spacingLeft = totalCards > 1 ? availableWidth / (totalCards - 1) : 0;

      // Ensure minimum spacing between cards
      spacingTop = Math.max(minSpacing, spacingTop);
      spacingLeft = Math.max(minSpacing, spacingLeft);

      // For consistent diagonal movement, don't clamp to available space
      // Allow cards to continue moving in bottom-right direction
      return {
        top: `${index * spacingTop}px`,
        left: isDesktop ? `${index * spacingLeft}px` : "0",
      };
    };

    const updatePosition = () => {
      setPosition(getCardPosition());
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [
    isMounted,
    index,
    totalCards,
    desktopDimensions,
    mobileDimensions,
    isDesktop,
  ]);

  return (
    <div
      className={cn(
        "-translate-x-1/2 absolute left-1/2 backdrop-blur-sm transition-all ease-out md:left-0 md:translate-x-0",
        current ? "opacity-100" : "opacity-0",
      )}
      style={{
        top: current ? position.top : "0px",
        left: isMounted && isDesktop ? position.left : undefined,
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      <Card
        className={cn(
          "relative overflow-hidden bg-background/30",
          cardClassName,
        )}
        style={{
          width: `${isDesktop ? desktopDimensions.width : mobileDimensions.width}px`,
          height: `${isDesktop ? desktopDimensions.height : mobileDimensions.height}px`,
        }}
      >
        <CardHeader className="flex h-full flex-col justify-between p-4 md:p-6">
          {cardStyle === "default" ? (
            <CardTitle className="font-mono font-semibold text-2xl text-main/50 md:text-5xl">
              {title}
            </CardTitle>
          ) : (
            <CardTitle className="font-mono font-semibold text-3xl text-main/50 md:text-7xl">
              {(index + 1).toString().padStart(2, "0")}
            </CardTitle>
          )}
          <CardDescription className="overflow-y-auto text-sm md:text-xl">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
