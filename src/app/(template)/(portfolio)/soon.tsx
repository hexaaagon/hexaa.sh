import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LightRays } from "@/components/ui/light-rays";
import { PlusSeparator } from "@/components/ui/plus-separator";

export default function SoonSection() {
  return (
    <main className="w-full border-separator/10 border-t">
      <div className="inner relative flex flex-col items-center border-separator/10 border-x py-18">
        <LightRays />
        <p className="text-center font-medium text-3xl">
          This website isn't ready yet...
        </p>
        <p className="mx-2 mt-1 max-w-2xl text-center text-muted-foreground text-xs sm:text-sm md:text-base">
          i'm very bad at creative things, this simple page tooks me 4 days to
          complete (5 hours per day!). let me know if you have any ideas to make
          my site better via guestbook!
        </p>
        <Button asChild className="mt-4">
          <Link href="/guestbook">Visit Guestbook - Siege Week 7</Link>
        </Button>
        <PlusSeparator
          main={{
            className: "-top-[4px]",
          }}
          position={["top-left", "top-right"]}
        />
      </div>
    </main>
  );
}
