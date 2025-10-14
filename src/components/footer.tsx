"use client";
import { sendGAEvent } from "@next/third-parties/google";

import Link from "next/link";
import HCWebring from "./hackclub-webring";
import { PlusSeparator } from "./ui/plus-separator";

export default function Footer() {
  return (
    <footer className="w-full border border-separator/10">
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
        </p>
        <div className="flex">
          <HCWebring />
        </div>
        <PlusSeparator position={["top-left", "top-right"]} />
      </div>
    </footer>
  );
}
