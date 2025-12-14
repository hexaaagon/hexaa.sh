"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr/immutable";

import { PlusSeparator } from "@/components/ui/plus-separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { wakaTimeData } from "@/lib/actions/wakatime";
import { cn } from "@/lib/utils";

import SkillsSection from "./about-skills";
import helloBanner from "#/static/images/typography/hello.webp";
import Link from "next/link";

export default function AboutSection() {
  const wakatimeStats = useSWR("wakatime", wakaTimeData);
  const [age, setAge] = useState(ageCalc());

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(ageCalc());
    }, 75);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <main className="w-full border-separator/10 border-t">
        <div className="inner relative flex h-full flex-col border-separator/10 border-x px-2 text-sm sm:px-4 sm:text-base xl:flex-row xl:justify-between xl:px-8">
          <div className="py-24 xl:max-w-7/11">
            <Image
              src={helloBanner}
              alt="hello."
              height={60}
              width={120}
              className="-mt-5 pointer-events-none mb-4 select-none dark:invert"
              fetchPriority="high"
              unoptimized
            />
            <p>
              i'm hexaa, but my real name is bagas. i am a{" "}
              <Tooltip>
                <TooltipTrigger className="underline decoration-dashed">
                  {Math.floor(age)}-year-old
                </TooltipTrigger>
                <TooltipContent>
                  <p>{age.toFixed(9)}</p>
                </TooltipContent>
              </Tooltip>{" "}
              student and a self-taught software engineer. growing up, i spent a
              lot of time playing with computers, and now i love building things
              just with code. i am passionate about learning new technologies
              and constantly improving my skills.
            </p>
            <br />
            <p>
              if you're curious, i started coding when i was 11. at the time, i
              was bored of just playing minecraft every day, chatting with my
              friends, sitting at the chair at all times. so i began exploring
              discord bot templates. i wondered, "what if i could make one
              myself?" and that's what inspired me to start coding. since then,
              i've invested over{" "}
              <Tooltip open={wakatimeStats.isLoading ? false : undefined}>
                <TooltipTrigger
                  className={cn(
                    "cursor-pointer underline decoration-dashed",
                    wakatimeStats.isLoading &&
                      "animate-pulse rounded-md bg-accent text-accent",
                  )}
                  onClick={() => {
                    window.open("https://wakatime.com/@hexaaagon", "_blank");
                  }}
                >
                  {wakatimeStats.isLoading
                    ? "xxxx"
                    : (
                        Math.floor(
                          (wakatimeStats.data?.total_seconds || 0) / 60 / 60,
                        ) / 1000
                      ).toFixed(3)}{" "}
                  hours
                  <span className="sr-only">WakaTime profile</span>
                </TooltipTrigger>
                <TooltipContent className="text-center">
                  <p>{wakatimeStats.data?.human_readable_total}</p>
                  <p>Click to open my Wakatime Account</p>
                </TooltipContent>
              </Tooltip>{" "}
              into coding, brainstorming, and even struggling through bugs that
              seemed impossible to fix.
            </p>
          </div>
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
            <div className="flex flex-col justify-between rounded-xs border bg-muted/50 p-4 shadow-sm dark:bg-muted/20">
              <h2 className="font-semibold text-lg">philosophy</h2>
              <p className="mt-1 leading-tight">
                I’d rather ship slow and solid than fast and fragile. Every
                project is an opportunity to build something that feels precise,
                calm, and durable, not just “done.”
              </p>
              <Link
                href="/about"
                className="mt-2 font-mono text-blue-600 text-sm hover:underline dark:text-blue-400"
              >
                [/about]
              </Link>
            </div>
          </div>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </main>

      <SkillsSection />
    </>
  );
}

export function ageCalc() {
  const birthDate = new Date("2010-08-02T00:00:00+07:00");
  const now = new Date();

  const ageInMilliseconds = now.getTime() - birthDate.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
}
