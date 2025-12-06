"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import moment from "moment-timezone";

import { cn } from "@/lib/utils";
import BauhausGenerator from "@/components/portfolio/bauhaus-generator";
import { PlusSeparator } from "@/components/ui/plus-separator";

import { cva } from "class-variance-authority";
import { useThemeStore } from "@/lib/store/hero-theme";

const backgroundImageVariants = cva("", {
  variants: {
    variant: {
      contour:
        "bg-[url(/static/images/hero-background/contour_dark.svg)] bg-no-repeat bg-cover bg-position-[center_top_30svh] dark:bg-[url(/static/images/hero-background/contour_light.svg)]",
      blackhole:
        "bg-[url(/static/images/hero-background/blackhole_dark.png)] bg-no-repeat bg-cover bg-position-[center_top_3svh] dark:bg-[url(/static/images/hero-background/blackhole_light.png)]",
    },
  },
  defaultVariants: {
    variant: "contour",
  },
});

export default function HeroSection() {
  const { themes, currentThemeIndex, cycleTheme } = useThemeStore();
  const currentTheme = themes[currentThemeIndex];

  return (
    <section className="relative flex flex-col">
      <div
        className={cn(
          "inner relative flex h-[80vh] flex-col justify-around border-separator/10 border-x border-t px-4 transition-all *:transition-all sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:px-16",
          backgroundImageVariants({ variant: currentTheme }),
        )}
      >
        <span className="flex flex-col *:transition-all lg:pb-64">
          <h1 className="font-medium font-montreal text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-14">
            hey, i&apos;m hexaa 👋
          </h1>
          <p className="max-w-[450px] text-xs leading-4 sm:text-sm lg:text-base lg:leading-5">
            a self-taught software engineer with a strong foundation in
            full-stack development, driven by a passion for building impactful
            solutions.
          </p>
        </span>
        <span className="flex w-full justify-center md:w-auto md:justify-end">
          <p className="w-full max-w-[350px] text-center font-montreal-mono text-muted-foreground text-xs sm:text-sm md:text-base lg:w-auto lg:pt-52 lg:text-end">
            &quot;a journey that began as a hobby and evolved into a deep
            commitment to technology and problem-solving.&quot;
          </p>
        </span>
      </div>
      <div className="border-separator/10 border-t">
        <div className="inner relative m-auto border-separator/10 border-x p-4">
          <span className="relative flex items-center justify-between font-montreal-mono text-xs opacity-90 transition-opacity duration-300 dark:opacity-75">
            <Link href="https://time.is/Jakarta" target="_blank">
              [<LocalTime />]
            </Link>
            <button type="button" onClick={cycleTheme}>
              <BauhausGenerator />
            </button>
          </span>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </div>
    </section>
  );
}

const LocalTime = dynamic(
  () =>
    Promise.resolve(() => {
      const [localTime, setLocalTime] = useState<string>(
        moment.tz("Asia/Jakarta").format("h:mm A"),
      );

      useEffect(() => {
        const timeInterval = setInterval(() => {
          setLocalTime(moment.tz("Asia/Jakarta").format("h:mm A"));
        }, 5000);

        return () => clearInterval(timeInterval);
      }, []);

      return <>{localTime}</>;
    }),
  { ssr: false },
);
