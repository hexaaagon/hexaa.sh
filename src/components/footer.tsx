"use client";
import { sendGAEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

import Link from "next/link";
import HCWebring from "./hackclub-webring";
import { PlusSeparator } from "./ui/plus-separator";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="relative h-[50px] w-full border-separator/10 border-y">
      <span className="-z-40 absolute right-0 bottom-2 left-0 h-6 max-w-dvw bg-[#D9D9D9]/40 blur-[80px]" />

      <div className="inner relative flex items-center justify-between border-x p-4">
        <p className="max-w-[60%] text-2xs text-muted-foreground leading-3">
          This website is available on{" "}
          <Link
            href="https://github.com/hexaaagon/hexaa.sh"
            className="underline transition-colors hover:text-primary"
            onClick={() =>
              sendGAEvent("event", "buttonClicked", {
                value: "footer-github",
              })
            }
          >
            Github
          </Link>{" "}
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && (
            <>
              <Link
                href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                className="underline transition-colors hover:text-primary"
                onClick={() =>
                  sendGAEvent("event", "buttonClicked", {
                    value: "footer-github-version",
                  })
                }
              >
                ({process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)})
              </Link>{" "}
            </>
          )}
          as open-source.
        </p>
        <div className="flex">
          {pathname === "/" ? (
            <HCWebring />
          ) : (
            <p className="font-mono text-2xs">{pathname}</p>
          )}
        </div>
        <PlusSeparator
          position={["top-left", "top-right"]}
          child={{
            "top-left": {
              className: "-top-[5px]",
            },
            "top-right": {
              className: "-top-[5px]",
            },
          }}
        />
      </div>
    </footer>
  );
}
