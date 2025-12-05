"use client";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

import { useThemeStore } from "@/lib/store/site-theme";

import HCWebring from "@/components/portfolio/navigation/hackclub-webring";
import { PlusSeparator } from "@/components/ui/plus-separator";

import { socials, pages } from "@/content/navigation/footer";

export default function Footer() {
  const { cycleMode } = useThemeStore();
  const pathname = usePathname();

  return (
    <footer>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative grid grid-cols-2 items-start justify-between gap-8 border-separator/10 border-x p-8 sm:grid-cols-3 md:grid-cols-6">
          <div className="col-span-2 my-auto flex flex-col gap-2 sm:col-span-3">
            <Link
              href="/"
              className="w-max bg-foreground pr-2 pl-1 font-semibold text-2xl text-background tracking-[-0.09em]"
            >
              hex.
            </Link>
            <p className="text-muted-foreground text-sm">
              yet another portfolio site.{" "}
              <button type="button" onClick={() => cycleMode()}>
                it's winter!
              </button>
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="text-foreground-text transition-colors hover:text-primary"
                  target="_blank"
                  onClick={() =>
                    sendGAEvent("event", "buttonClicked", {
                      value: `footer-social-${social.name.toLowerCase()}`,
                    })
                  }
                >
                  <social.icon size={24} />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-foreground-primary/80 text-lg">
              Personal
            </span>
            <nav className="flex flex-col gap-1 font-medium font-mono text-blue-600 text-foreground-text text-sm transition-all *:hover:underline dark:text-blue-400">
              {pages.personal.map((page) => (
                <Link key={page.name} href={page.href}>
                  [{page.name}]
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-foreground-primary/80 text-lg">
              Explore
            </span>
            <nav className="flex flex-col gap-1 font-medium font-mono text-blue-600 text-foreground-text text-sm transition-all *:hover:underline dark:text-blue-400">
              {pages.explore.map((page) => (
                <Link key={page.name} href={page.href}>
                  [{page.name}]
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-foreground-primary/80 text-lg">
              Meta
            </span>
            <nav className="flex flex-col gap-1 font-medium font-mono text-blue-600 text-foreground-text text-sm transition-all *:hover:underline dark:text-blue-400">
              {pages.meta.map((page) => (
                <Link key={page.name} href={page.href}>
                  [{page.name}]
                </Link>
              ))}
            </nav>
          </div>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </section>
      <section className="relative h-[50px] w-full border-separator/10 border-t">
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
              GitHub
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
      </section>
    </footer>
  );
}
