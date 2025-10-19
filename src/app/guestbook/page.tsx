import { PlusSeparator } from "@/components/ui/plus-separator";
import Image from "next/image";

export default function GuestbookPage() {
  return (
    <main className="mt-16">
      <div className="border-separator/10 border-t">
        <div className="inner relative flex max-w-[64rem] border-separator/10 border-x">
          <div className="hidden flex-col lg:flex">
            <div className="size-14 border-separator/10 border-r border-b sm:size-27"></div>
            <div className="grow border-separator/10 border-r"></div>
            <div className="size-14 border-separator/10 border-t border-r sm:size-27"></div>
          </div>
          <div className="flex grow flex-col">
            <div className="flex w-full">
              <div className="size-14 border-separator/10 border-r border-b sm:size-27"></div>
              <div className="hidden size-14 border-separator/10 border-r border-b sm:size-27 lg:block"></div>
              <div className="grow border-separator/10 border-b"></div>
              <div className="hidden size-14 border-separator/10 border-b border-l sm:size-27 lg:block"></div>
              <div className="size-14 border-separator/10 border-b border-l sm:size-27"></div>
            </div>
            <div className="group relative flex h-[12rem] overflow-hidden bg-background/50">
              <div className="absolute top-4 left-4 size-16 bg-foreground blur-[10rem] transition-all group-hover:blur-[7rem]"></div>
              <div className="absolute right-4 bottom-4 size-16 bg-foreground blur-[7rem] transition-all group-hover:blur-[6rem]"></div>
              <Image
                src="/static/images/typography/hexaas-guestbook.webp"
                alt="Hexaas Guestbook"
                width={1080}
                height={1080}
                className="h-full w-full object-cover opacity-70 transition group-hover:opacity-100 dark:opacity-80 dark:invert group-hover:dark:opacity-100"
              />
            </div>
            <div className="flex w-full">
              <div className="size-14 border-separator/10 border-t border-r sm:size-27"></div>
              <div className="hidden size-14 border-separator/10 border-t border-r sm:size-27 lg:block"></div>
              <div className="grow border-separator/10 border-t"></div>
              <div className="hidden size-14 border-separator/10 border-t border-l sm:size-27 lg:block"></div>
              <div className="size-14 border-separator/10 border-t border-l sm:size-27"></div>
            </div>
          </div>
          <div className="hidden flex-col lg:flex">
            <div className="size-14 border-separator/10 border-b border-l sm:size-27"></div>
            <div className="grow border-separator/10 border-l"></div>
            <div className="size-14 border-separator/10 border-t border-l sm:size-27"></div>
          </div>
          <PlusSeparator
            main={{ className: "-top-[5px]" }}
            position={["top-left", "top-right"]}
          />
        </div>
        <div className="border-separator/10 border-y">
          <div className="inner relative flex h-[64rem] max-w-[64rem] border-separator/10 border-x">
            a
          </div>
        </div>
      </div>
    </main>
  );
}
