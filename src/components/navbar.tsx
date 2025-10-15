"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "./hooks/use-mobile";
import ThemeSwitch from "./theme-switch";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { PlusSeparator } from "./ui/plus-separator";
import { Button } from "./ui/button";

const navItems = [
  { href: "/about", title: "about" },
  { href: "/projects", title: "projects" },
  { href: "/blog", title: "blog" },
  { href: "/guestbook", title: "guestbook" },
];

export default function Navbar() {
  const isMobile = useIsMobile({ breakpoint: 512 });
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header>
      <div className="-z-50 absolute top-0 right-0 left-0 mx-auto blur-[250px]">
        <span
          className="absolute top-0 right-0 left-0 m-0 mx-auto h-[25vh] w-[90vw] bg-[#1D1EF0] p-0 transition-all sm:h-[15vh] md:h-[10vh] md:w-[80vw] dark:bg-[#6964ED]/80"
          style={{
            clipPath: "polygon(0% 51%, 50% 0%, 100% 51%, 100% 100%, 0% 100%)",
          }}
        />
      </div>
      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-separator/10 border-b px-4 py-4 backdrop-blur-lg transition-all duration-300 sm:px-12 md:px-16 lg:px-24 xl:px-32">
        <div className="inner absolute right-0 bottom-0 left-0">
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            child={{
              "bottom-left": { className: "-bottom-[5px] -left-[3px]" },
              "bottom-right": { className: "-bottom-[5px] -right-[3px]" },
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          {isMounted && isMobile && (
            <Drawer open={open} onOpenChange={setOpen} direction="top">
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="gap-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="!size-4"
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
            className="font-medium font-mono text-xs transition sm:text-base"
          >
            hexaa
          </Link>
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
    </header>
  );
}
