"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import ThemeSwitch from "./theme-switch";
import { useIsMobile } from "./hooks/use-mobile";

export default function Navbar() {
  const isMobile = useIsMobile({ breakpoint: 512 });
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHalfScreen, setIsHalfScreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 15);
      setIsHalfScreen(window.scrollY >= window.innerHeight / 4);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <div className="absolute top-0 right-0 left-0 -z-50 mx-auto blur-[250px]">
        <span
          className="absolute top-0 right-0 left-0 m-0 mx-auto h-[25vh] w-[90vw] bg-[#1D1EF0] p-0 transition-all sm:h-[15vh] md:h-[10vh] md:w-[80vw] dark:bg-[#6964ED]/80"
          style={{
            clipPath: "polygon(0% 51%, 50% 0%, 100% 51%, 100% 100%, 0% 100%)",
          }}
        />
      </div>
      <div
        className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b-2 px-11 backdrop-blur-lg transition-all duration-300 sm:px-12 md:px-16 lg:px-24 xl:px-32 ${isAtTop ? "border-transparent py-6" : "border-border py-3"}`}
      >
        <Link
          href="/"
          className="font-mono text-xs font-medium transition sm:text-base"
        >
          hexaa
        </Link>
        <div className="flex items-center gap-6">
          {isMounted && (
            <nav
              className={`font-montreal-mono flex gap-4 text-xs ${isHalfScreen || pathname !== "/" ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}
            >
              <Link href="/about">about</Link>
              {!isMobile && (
                <>
                  <Link href="/projects">projects</Link>
                  <Link href="/blog">blog</Link>
                </>
              )}
              <Link href="/guestbook">guestbook</Link>
            </nav>
          )}
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}

export function HeroNav({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile({ breakpoint: 1024 });

  return (
    <>
      {isMobile && children}
      <nav className="*:text-foreground/70 font-montreal-mono flex gap-2 pt-2 text-xs">
        <Link href="/about">[about]</Link>
        <Link href="/projects">[projects]</Link>
        <Link href="/blog">[blog]</Link>
        <Link href="/guestbook">[guestbook]</Link>
      </nav>
      {!isMobile && children}
    </>
  );
}
