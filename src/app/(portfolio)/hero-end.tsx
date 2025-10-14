"use client";

import { PlusSeparator } from "@/components/ui/plus-separator";
import moment from "moment-timezone";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroEnd() {
  return (
    <div className="w-full border border-separator/10">
      <div className="inner relative m-auto border-separator/10 border-x p-4">
        <span className="relative flex items-end justify-between font-montreal-mono text-xs opacity-90 transition-[opacity] duration-300 dark:opacity-75">
          <Link href="https://time.is/Jakarta" target="_blank">
            [<LocalTime />]
          </Link>
          <p>— 01</p>
        </span>
        <PlusSeparator
          position={["bottom-left", "bottom-right", "top-left", "top-right"]}
        />
      </div>
    </div>
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
