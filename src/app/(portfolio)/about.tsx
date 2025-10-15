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
    <footer className="w-full border-separator/10 border-t">
      <div className="inner relative flex flex-col justify-center border-separator/10 border-x px-8 py-24 text-sm sm:text-base">
        <Image
          src="/static/images/typography/hello.webp"
          alt="hello."
          height={60}
          width={120}
          className="-mt-5 pointer-events-none mb-4 select-none dark:invert"
        />
        <p className="w-full lg:w-7/11">
          i'm hexaa, but my real name is bagas. i am a{" "}
          <Tooltip>
            <TooltipTrigger className="underline decoration-dashed">
              {Math.floor(age)}-year-old
            </TooltipTrigger>
            <TooltipContent>
              <p>{age.toFixed(9)}</p>
            </TooltipContent>
          </Tooltip>{" "}
          student and a self-taught software engineer. growing up, i spent a lot
          of time playing with computers, and now i love building things just
          with code. i am passionate about learning new technologies and
          constantly improving my skills.
        </p>
        <br />
        <p className="w-full lg:w-7/11">
          if you're curious, i started coding when i was 11. at the time, i was
          bored of just playing minecraft every day and sitting at the chair at
          all times, chatting with my friends. so i began exploring discord bot
          templates. i wondered, "what if i could make one myself?" and that's
          what inspired me to start coding. since then, i've invested over{" "}
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
        <PlusSeparator position={["top-left", "top-right"]} />
      </div>
    </footer>
  );
}

export function ageCalc() {
  const birthDate = new Date("2010-08-02T00:00:00+07:00");
  const now = new Date();

  const ageInMilliseconds = now.getTime() - birthDate.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
}
