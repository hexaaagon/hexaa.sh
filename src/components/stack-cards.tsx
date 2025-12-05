"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Star8 from "./stars/s8";
import Star14 from "./stars/s14";
import Star15 from "./stars/s15";

import { ScrollVelocityRotate } from "./scroll-velocity-rotate";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const cardData = [
  {
    id: 1,
    star: Star8,
    title: "Built for TailwindCSS",
    description:
      "These components utilize Tailwind and its versatile utility classes, enabling swift and straightforward styling.",
    color: "rgba(0, 214, 150, 0.1)",
  },
  {
    id: 2,
    star: Star14,
    title: "Based on Shadcn UI",
    description:
      "All of the components are based on shadcn/ui, meaning high-quality components with best practices.",
    color: "rgba(236, 55, 80, 0.1)",
  },
  {
    id: 3,
    star: Star15,
    title: "Customizable",
    description:
      "You can easily customize these components to suit your needs.",
    color: "rgba(59, 130, 246, 0.1)",
  },
];

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
  id: number;
  star: typeof Star8;
  title: string;
  description: string;
  index: number;
  totalCards: number;
  color: string;
  specialCase?: string;
}

const StackCard: React.FC<CardProps> = ({
  id,
  star: Star,
  title,
  description,
  index,
  totalCards,
  color,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const targetScale = 1 - (totalCards - index) * 0.05;

    // Set initial state
    gsap.set(card, {
      scale: 1,
      transformOrigin: "center top",
    });

    // Create scroll trigger for stacking effect
    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = gsap.utils.interpolate(1, targetScale, progress);

        gsap.set(card, {
          scale: Math.max(scale, targetScale),
          transformOrigin: "center top",
        });
      },
    });

    return () => {
      for (const trigger of ScrollTrigger.getAll()) {
        trigger.kill();
      }
    };
  }, [index, totalCards]);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex min-h-[75vh] flex-col items-center justify-center"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[800px] origin-top px-2 md:px-4"
        style={{
          top: `calc(-5vh + ${index * 25}px)`,
        }}
      >
        <Card
          className="relative flex min-h-[400px] flex-col justify-start gap-2 border-[3px] px-2 pt-8 md:gap-6 md:px-5 md:pt-12"
          style={{
            borderColor: color,
          }}
        >
          <CardHeader>
            <ScrollVelocityRotate className="h-min w-min" baseVelocity={75}>
              <Star
                size={48}
                className="mb-1 stroke-6 stroke-foreground text-main"
              />
            </ScrollVelocityRotate>
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm sm:text-lg md:text-xl">
              {description}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const StackedCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <section ref={containerRef} className="w-full">
      {cardData.map((card, index) => (
        <StackCard
          key={card.id}
          id={card.id}
          star={card.star}
          title={card.title}
          description={card.description}
          index={index}
          totalCards={cardData.length}
          color={card.color}
        />
      ))}
    </section>
  );
};
