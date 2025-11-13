"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import useSWR from "swr/immutable";
import { getLinkInfo } from "@/lib/actions/dub";

import { Loader2 } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { LinkSchema } from "dub/models/components";
import { DubRedirectCard } from "@/components/dub-redirect-card";
import { Separator } from "@/components/ui/separator";

export const fetchCache = "force-no-store";

export default function NotFound() {
  const pathname = usePathname().replace(/^\//, "");
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we're on client side before making API calls
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldFetch = isMounted && pathname;
  const { data, isLoading } = useSWR(
    shouldFetch ? `dub-links:${pathname}` : null,
    () => getLinkInfo("go.hexaa.sh", pathname),
  );

  if (!isMounted || isLoading) {
    return (
      <Empty className="gap-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Loader2 className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>We are checking if this page exists...</EmptyTitle>
          <EmptyDescription>
            Please hold on while we verify the availability of this page and
            retrieve the necessary information for you.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (!data || !pathname) {
    return (
      <main className="flex flex-col items-center justify-center">
        <p>404 - no page found</p>
        <Link
          className="font-mono text-sky-700 transition-all hover:underline sm:text-sm dark:text-sky-600"
          href="/"
        >
          [go back?]
        </Link>
      </main>
    );
  }

  // Redirect component with countdown
  return <RedirectWithCountdown data={data} />;
}

function RedirectWithCountdown({ data }: { data: LinkSchema }) {
  const [countdown, setCountdown] = useState(2);
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(searchParams.toString());

    // Capture and preserve referrer if not already present
    if (document.referrer && !params.has("ref") && !params.has("referrer")) {
      params.set("ref", document.referrer);
    }

    const paramsString = params.toString();
    const redirectUrl = `${data.url}${paramsString ? `?${paramsString}` : ""}${hash}`;

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect after countdown reaches 0
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data, searchParams]);

  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const params = new URLSearchParams(searchParams.toString());

  // Add referrer for the clickable link as well
  if (
    typeof window !== "undefined" &&
    document.referrer &&
    !params.has("ref") &&
    !params.has("referrer")
  ) {
    params.set("ref", document.referrer);
  }

  const paramsString = params.toString();
  const redirectUrl = `${data.url}${paramsString ? `?${paramsString}` : ""}${hash}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:flex-row md:gap-12">
      <DubRedirectCard data={data} />

      <div className="w-32 md:h-32 md:w-0">
        <Separator orientation="vertical" className="hidden md:block" />
        <Separator orientation="horizontal" className="block md:hidden" />
      </div>

      <div className="text-center md:text-start">
        <p className="font-medium text-lg text-neutral-700 dark:text-neutral-300">
          Redirecting in {countdown} second{countdown > 1 ? "s" : ""}...
        </p>
        <Link
          className="inline-block font-mono text-blue-600 text-sm transition-colors hover:underline dark:text-blue-400"
          href={redirectUrl}
        >
          [redirect now?]
        </Link>
      </div>
    </div>
  );
}
