"use client";
import { sendGAEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

import Link from "next/link";
import HCWebring from "./hackclub-webring";
import { PlusSeparator } from "./ui/plus-separator";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="h-[50px] w-full border-separator/10 border-y">
      <div className="inner relative flex items-center justify-between border-x p-4">
        <p className="max-w-[60%] text-2xs text-muted-foreground leading-3">
          This website is available on{" "}
          <Link
            href="https://github.com/hexaaagon/personal-web"
            className="underline transition-colors hover:text-primary"
            onClick={() =>
              sendGAEvent("event", "buttonClicked", {
                value: "footer-github",
              })
            }
          >
            Github
          </Link>{" "}
          as open-source.
          {process.env.VERCEL_GIT_COMMIT_SHA && (
            <Link
              href={`https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
              className="underline transition-colors hover:text-primary"
              onClick={() =>
                sendGAEvent("event", "buttonClicked", {
                  value: "footer-github-version",
                })
              }
            >
              {process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)}
            </Link>
          )}
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
