import TrailingScroll from "@/labs-registry/components-v1/trailing-scroll";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

import Star8 from "@/components/stars/s8";
import Star14 from "@/components/stars/s14";
import Star15 from "@/components/stars/s15";
import Star20 from "@/components/stars/s20";

export default function Page() {
  return (
    <div className="relative flex w-screen flex-col items-center justify-center pt-28">
      <header className="mb-24 text-center">
        <h2 className="font-medium text-xl md:text-3xl">
          just a small faq section
        </h2>
        <p className="text-center text-muted-foreground text-sm md:text-lg">
          you may see some stars floating around ✨
        </p>
      </header>
      <div className="flex w-2/3 items-center justify-center pb-[30rem]">
        <Accordions type="single" className="m-auto w-full">
          <Accordion title="why did hexaa made this lmfao">
            idk im bored send help pls
          </Accordion>
          <Accordion title="ts is so pointless ngl">then dont use it</Accordion>
          <Accordion title="this is the last accordion">yes it is</Accordion>
        </Accordions>
      </div>
      <TrailingScroll
        elements={[
          {
            id: "star-1",
            component: (
              <Star20
                className="size-8 scale-300 stroke-3 stroke-foreground text-main md:size-12"
                size={48}
              />
            ),
            speed: 10,
            className: "absolute left-[15%] top-[10%] blur-[1px]",
          },
          {
            id: "star-2",
            component: (
              <Star15
                className="size-8 scale-300 stroke-3 stroke-foreground text-main md:size-12"
                size={48}
              />
            ),
            speed: 6,
            className: "absolute right-[10%] top-[10%] blur-[1px]",
          },
          {
            id: "star-3",
            component: (
              <Star14
                className="size-8 scale-300 stroke-3 stroke-foreground text-main md:size-12"
                size={48}
              />
            ),
            speed: 19,
            className: "absolute left-[10%] top-[60%] blur-[3px]",
          },
          {
            id: "star-4",
            component: (
              <Star8
                className="size-8 scale-300 stroke-3 stroke-foreground text-main md:size-12"
                size={48}
              />
            ),
            speed: 8,
            className: "absolute right-[35%] bottom-[45%] blur-[2px]",
          },
        ]}
        containerClassName="absolute inset-0 z-20 opacity-[92%] pointer-events-none"
        speedMultiplier={25}
      />
    </div>
  );
}
