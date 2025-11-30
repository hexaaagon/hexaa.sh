"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useIsMobile } from "@/components/hooks/use-mobile";
import ThemeSwitch from "@/components/theme-switch";

import { Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { Separator } from "@/components/ui/separator";

import {
  backItems,
  navItems,
  separatorItems,
  shadeExcludeItems,
} from "@/content/navigation/navbar";

export default function Navbar() {
  const isMobile = useIsMobile({ breakpoint: 512 });
  const [isMounted, setIsMounted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      {matchPath(pathname, shadeExcludeItems) ? null : (
        <div
          className="-z-50 absolute top-0 right-0 left-0 mx-auto"
          style={{ filter: "blur(clamp(200px, 10vw, 250px))" }}
        >
          <span
            className="absolute top-0 right-0 left-0 m-0 mx-auto h-[25vh] w-[90vw] bg-[#1D1EF0] p-0 sm:h-[15vh] md:h-[10vh] md:w-[80vw] dark:bg-[#6964ED]/80"
            style={{
              clipPath: "polygon(0% 51%, 50% 0%, 100% 51%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
      )}
      <div
        className={`fixed top-0 right-0 left-0 z-50 border-separator/10 border-b p-4 backdrop-blur-sm transition duration-300 ${!isAtTop && "bg-background/80 dark:bg-background/60"}`}
      >
        <div className="inner flex items-center justify-between md:px-8">
          {matchPath(pathname, separatorItems) && (
            <div className="inner absolute right-0 bottom-0 left-0">
              <PlusSeparator
                position={["bottom-left", "bottom-right"]}
                child={{
                  "bottom-left": { className: "-bottom-[5px] -left-[3px]" },
                  "bottom-right": { className: "-bottom-[5px] -right-[4px]" },
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-1">
            {isMounted && isMobile && (
              <Drawer open={open} onOpenChange={setOpen} direction="top">
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="gap-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    {/** biome-ignore lint/a11y/noSvgWithoutTitle: there's no thing in the lucide icon package */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4!"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 9h16.5m-16.5 6.75h16.5"
                      />
                    </svg>
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80svh] p-0">
                  <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
                  <div className="overflow-auto p-6">
                    <div className="flex flex-col space-y-3">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            router.push(item.href);
                            setOpen(false);
                          }}
                          className="font-montreal text-2xl"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
            <Link
              href="/"
              className="font-medium font-mono text-xs sm:text-base"
            >
              hexaa
            </Link>
            {matchPath(pathname, backItems) && (
              <Link href="/blog" className="flex h-4 items-center">
                <Separator orientation="vertical" className="mr-0 ml-2" />
                <button type="button" className="py-2 pr-2 pl-4">
                  <Undo size={16} />
                </button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-6">
            {isMounted && !isMobile && (
              <nav className="flex gap-4 font-montreal-mono text-xs transition-opacity duration-300">
                <Link href="/about">about</Link>
                <Link href="/projects">projects</Link>
                <Link href="/blog">blog</Link>
                <Link href="/guestbook">guestbook</Link>
              </nav>
            )}
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}

function matchPath(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern === pathname) return true;

    if (pattern.includes("/**")) {
      const basePattern = pattern.replace("/**", "");
      return pathname.startsWith(basePattern);
    }

    if (pattern.includes("/*")) {
      const regexPattern = pattern
        .split("/")
        .map((segment) => {
          if (segment === "*") return "[^/]+";
          return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("/");

      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(pathname);
    }

    return false;
  });
}
