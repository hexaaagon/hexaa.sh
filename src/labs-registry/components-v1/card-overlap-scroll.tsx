"use client";

import { useRef, useState, useEffect } from "react";
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

interface RequirementCard {
  description: string | React.ReactNode;
  number?: number;
}

const defaultCards: RequirementCard[] = [
  {
    description: "Your project must be open-source, original, and unique.",
  },
  {
    description: "Track your progress with Hackatime while building.",
  },
  {
    description:
      "The project must involved with your webcam or your phone camera.",
  },
  {
    description: "You must code at least 30 hours on your project.",
  },
  {
    description: "Last thing, add a README to your project repository 😭",
  },
];

interface RequirementCardsProps {
  cards?: RequirementCard[];
  className?: string;
}

export function RequirementCards({
  cards = defaultCards,
  className,
}: RequirementCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState({ top: 0, height: 0 });
  const [current, setCurrent] = useState(0);
  const [backgroundHeight, setBackgroundHeight] = useState("200vh");
  const [scrollHeight, setScrollHeight] = useState("100vh");
  const [endScrollVh, setEndScrollVh] = useState(0);

  const parallaxRatio = 0.1;

  // Calculate scroll height based on cards count and device
  useEffect(() => {
    const calculateScrollHeight = () => {
      const isDesktop = window.innerWidth >= 768;
      // Base scroll per card: desktop short, mobile longer for readability
      const scrollPerCard = isDesktop ? 60 : 120;
      // Add extra scroll at start and end
      const baseScroll = isDesktop ? 80 : 200;
      const endScroll = isDesktop ? 100 : 150;
      setEndScrollVh(endScroll);
      const totalScroll = baseScroll + cards.length * scrollPerCard + endScroll;
      setScrollHeight(`${totalScroll}vh`);
    };

    calculateScrollHeight();
    window.addEventListener("resize", calculateScrollHeight);
    return () => window.removeEventListener("resize", calculateScrollHeight);
  }, [cards.length]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
        const extraHeight = height * parallaxRatio;
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
        const parallaxOffset = relativeScroll * -parallaxRatio;
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
      className={cn("relative", className)}
      style={{ minHeight: scrollHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden p-4 md:p-8">
        {/* Parallax Background */}
        <div
          ref={backgroundRef}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-position-[center_center] bg-size-[70px_70px] will-change-transform"
          style={{ height: backgroundHeight }}
        >
          <div className="absolute top-0 right-0 left-0 h-[15vh] w-full bg-linear-to-b from-background to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 h-[30vh] w-full bg-linear-to-t from-background to-transparent" />
        </div>
        <div className="relative h-full">
          <aside className="mb-8 text-right md:absolute md:top-0 md:right-0">
            <h2 className="font-bold text-xl sm:text-4xl xl:text-5xl 2xl:text-6xl">
              Follow the <i>requirement</i> first,
              <br />
              <span className="text-foreground/70">
                Then ship your <i>project</i>.
              </span>
            </h2>
          </aside>

          <div
            ref={cardsContainerRef}
            className="relative h-full pt-24 md:pt-0"
          >
            {cards.map((card, index) => (
              <SingleCard
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                index={index}
                description={card.description}
                number={card.number || index + 1}
                current={index <= current - 1}
                totalCards={cards.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SingleCardProps {
  description?: string | React.ReactNode;
  number: number;
  index: number;
  current: boolean;
  totalCards: number;
}

function SingleCard({
  description,
  number,
  index,
  current,
  totalCards,
}: SingleCardProps) {
  const [position, setPosition] = useState({ top: "0px", left: "0" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const getCardPosition = () => {
      // Calculate available space (screen height/width minus card size and padding)
      const cardHeight = window.innerWidth >= 768 ? 320 : 200; // 20rem = 320px
      const cardWidth = window.innerWidth >= 768 ? 480 : 280; // 30rem = 480px
      const padding = window.innerWidth >= 768 ? 64 : 32; // Account for container padding

      // On mobile, use a percentage-based approach to distribute cards more evenly
      const availableHeight =
        window.innerWidth >= 768
          ? window.innerHeight - cardHeight - padding * 2
          : window.innerHeight * 0.4;
      const availableWidth = window.innerWidth - cardWidth - padding * 2;

      // Calculate spacing between cards
      const spacingTop =
        totalCards > 1 ? availableHeight / (totalCards - 1) : 0;
      const spacingLeft =
        totalCards > 1 ? availableWidth / (totalCards - 1) : 0;

      return {
        top: `${Math.max(0, Math.min(index * spacingTop, availableHeight))}px`,
        left:
          window.innerWidth >= 768
            ? `${Math.max(0, Math.min(index * spacingLeft, availableWidth))}px`
            : "0",
      };
    };

    const updatePosition = () => {
      setPosition(getCardPosition());
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isMounted, index, totalCards]);

  return (
    <div
      className={cn(
        "-translate-x-1/2 absolute left-1/2 backdrop-blur-sm transition-all duration-1000 ease-out md:left-0 md:translate-x-0",
        current ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      )}
      style={{
        top: position.top,
        left: isMounted && window.innerWidth >= 768 ? position.left : undefined,
      }}
    >
      <Card className="relative h-[200px] w-[280px] overflow-hidden bg-background/30 md:h-[20rem] md:w-[30rem]">
        <CardHeader className="h-full">
          <CardTitle className="font-mono font-semibold text-3xl text-main/50 md:text-7xl">
            0{index + 1}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm md:text-xl">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
