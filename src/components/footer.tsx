"use client";
import { sendGAEvent } from "@next/third-parties/google";

import Link from "next/link";
import HCWebring from "./hackclub-webring";

export default function Footer() {
  return (
    <footer className="-mx-[4%] flex items-center justify-between py-4">
      <p className="text-muted-foreground text-2xs max-w-[60%] leading-3">
        This website is available on{" "}
        <Link
          href="https://github.com/hexaaagon/personal-web"
          className="hover:text-primary underline transition-colors"
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
    </footer>
  );
}
