import Link from "next/link";

import { LightRays } from "@/components/ui/light-rays";
import { PlusSeparator } from "@/components/ui/plus-separator";

export default function SoonSection() {
  return (
    <main className="w-full border-separator/10 border-y">
      <div className="inner relative flex flex-col items-center border-separator/10 border-x px-2 py-28">
        <LightRays />
        <p className="text-center font-medium text-2xl">
          idk what to put in here yet...
        </p>
        <p className="mx-2 mt-1 max-w-2xl text-center text-muted-foreground text-xs sm:text-sm">
          but hey, at least there's a new project, it's called{" "}
          <Link href="/labs" className="underline">
            Hexaa's Labs
          </Link>
          !
        </p>
        <PlusSeparator
          main={{
            className: "-top-[4px]",
          }}
          position={["top-left", "top-right"]}
        />
        <PlusSeparator
          main={{
            className: "-bottom-[4px]",
          }}
          position={["bottom-left", "bottom-right"]}
        />
      </div>
    </main>
  );
}
