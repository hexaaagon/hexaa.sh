"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hackclub from "#/static/images/hackclub.svg";
import Image from "next/image";

import Link from "next/link";
import useSWR from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getWebring } from "@/lib/actions/webring";
import posthog from "posthog-js";

export default function HCWebring() {
  const { data } = useSWR(
    "https://webring.hackclub.com/members.json",
    getWebring,
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger className="group flex items-center space-x-2">
          {!data ? (
            <ChevronLeft size={14} className="animate-pulse" />
          ) : (
            <Link
              href={data.previous.url}
              onClick={() =>
                posthog.capture("buttonClicked", {
                  location: "footer",
                  section: "webring",
                  value: "previous",
                })
              }
            >
              <ChevronLeft
                size={14}
                className="transition hover:text-blue-300"
              />
              <p className="sr-only">View previous member</p>
            </Link>
          )}
          <Link
            href="https://webring.hackclub.com"
            onClick={() =>
              posthog.capture("buttonClicked", {
                location: "footer",
                section: "webring",
                value: "home",
              })
            }
          >
            <Image
              src={hackclub}
              alt="Hack Club Webring"
              width={18}
              height={18}
              className="grayscale transition-[filter] duration-300 group-hover:grayscale-0"
            />
          </Link>
          {!data ? (
            <ChevronRight size={14} className="animate-pulse" />
          ) : (
            <Link
              href={data.next.url}
              onClick={() =>
                posthog.capture("buttonClicked", {
                  location: "footer",
                  section: "webring",
                  value: "next",
                })
              }
            >
              <ChevronRight
                size={14}
                className="transition hover:text-blue-300"
              />
              <p className="sr-only">View next member</p>
            </Link>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Click the arrows to see other websites of Hack Club members.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
