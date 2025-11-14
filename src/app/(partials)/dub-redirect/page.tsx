"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";

export default function DubRedirect() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <DubRedirectContent />
    </Suspense>
  );
}

function DubRedirectContent() {
  const searchParams = useSearchParams();
  const dubLink = searchParams.get("url");
  const originUrl = searchParams.get("origin_url");
  const dubKey = searchParams.get("key");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const image = searchParams.get("image");

  // If no Dub link data, redirect to 404
  if (!dubLink) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  return (
    <RedirectWithCountdown
      url={dubLink}
      originUrl={originUrl || ""}
      shortKey={dubKey || ""}
      title={title}
      description={description}
      image={image}
    />
  );
}

function RedirectWithCountdown({
  url,
  originUrl,
  shortKey,
  title,
  description,
  image,
}: {
  url: string;
  originUrl: string;
  shortKey: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
}) {
  const [countdown, setCountdown] = useState(2);
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(searchParams.toString());

    // Remove the internal params
    params.delete("url");
    params.delete("origin_url");
    params.delete("key");
    params.delete("title");
    params.delete("description");
    params.delete("image");

    // Capture and preserve referrer if not already present
    if (document.referrer && !params.has("ref") && !params.has("referrer")) {
      params.set("ref", document.referrer);
    }

    const paramsString = params.toString();
    const redirectUrl = `${url}${paramsString ? `?${paramsString}` : ""}${hash}`;

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
  }, [url, searchParams]);

  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const params = new URLSearchParams(searchParams.toString());

  // Remove internal params
  params.delete("url");
  params.delete("key");
  params.delete("title");
  params.delete("description");
  params.delete("image");

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
  const redirectUrl = `${url}${paramsString ? `?${paramsString}` : ""}${hash}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:flex-row md:gap-12">
      <div className="max-w-sm space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        {image && (
          <Image
            src={image}
            alt={title || "Link preview"}
            width={400}
            height={200}
            className="h-48 w-full rounded-md object-cover"
          />
        )}
        <div>
          <p className="font-medium text-lg">{title || "Short Link"}</p>
          <p className="font-mono text-muted-foreground text-sm">{originUrl}</p>
          {description && (
            <p className="mt-2 text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </div>

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
