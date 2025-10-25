import { PlusSeparator } from "@/components/ui/plus-separator";
import Image from "next/image";

export default function ProjectSection() {
  return (
    <main className="w-full border-separator/10 border-t">
      <div className="inner relative flex border-separator/10 border-x">
        <div className="hidden flex-col lg:flex">
          <div className="size-8 border-separator/10 border-r border-b sm:size-20"></div>
          <div className="grow border-separator/10 border-r"></div>
          <div className="size-8 border-separator/10 border-t border-r sm:size-20"></div>
        </div>
        <div className="flex grow flex-col">
          <div className="flex w-full">
            <div className="size-8 border-separator/10 border-r border-b sm:size-20"></div>
            <div className="hidden size-8 border-separator/10 border-r border-b sm:size-20 lg:block"></div>
            <div className="grow border-separator/10 border-b"></div>
            <div className="hidden size-8 border-separator/10 border-b border-l sm:size-20 lg:block"></div>
            <div className="size-8 border-separator/10 border-b border-l sm:size-20"></div>
          </div>
          <div className="group relative flex h-[12rem] flex-col justify-center gap-4 overflow-hidden px-2 sm:px-10 md:px-18">
            <Image
              src="/static/images/br-dither-gradient.png"
              alt="Dither"
              fill
              className="-z-10 absolute top-0 left-0 h-full w-full object-cover object-right opacity-30 invert dark:invert-0"
              fetchPriority="low"
            />
            <PlusSeparator position={["top-left", "top-right"]} />
            <h2 className="bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text font-montreal font-semibold text-transparent text-xl sm:text-2xl lg:text-3xl">
              the projects i've built
            </h2>
            <p className="max-w-[600px] text-xs leading-3.5 sm:text-sm sm:leading-6 md:text-base">
              here are some of the projects I&apos;ve worked on, showcasing my
              skills and passion for software development. each project reflects
              my commitment to creating impactful solutions and continuous
              learning.
            </p>
          </div>
          <div className="flex w-full">
            <div className="size-8 border-separator/10 border-t border-r sm:size-20"></div>
            <div className="hidden size-8 border-separator/10 border-t border-r sm:size-20 lg:block"></div>
            <div className="grow border-separator/10 border-t"></div>
            <div className="hidden size-8 border-separator/10 border-t border-l sm:size-20 lg:block"></div>
            <div className="size-8 border-separator/10 border-t border-l sm:size-20"></div>
          </div>
        </div>
        <div className="hidden flex-col lg:flex">
          <div className="size-8 border-separator/10 border-b border-l sm:size-20"></div>
          <div className="grow border-separator/10 border-l"></div>
          <div className="size-8 border-separator/10 border-t border-l sm:size-20"></div>
        </div>
        <PlusSeparator position={["top-left", "top-right"]} />
      </div>
    </main>
  );
}
