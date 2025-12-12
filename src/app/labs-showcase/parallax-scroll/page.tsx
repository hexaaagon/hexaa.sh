import dynamic from "next/dynamic";
import {
  ParallaxScroll,
  ParallaxLayer,
} from "@/labs-registry/components-v1/parallax-scroll";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  {
    ssr: false,
  },
);

export default function ParallaxScrollPage() {
  return (
    <main className="bg-[#2E2E2E] dark:bg-[#D1D1D1]">
      <ParallaxScroll
        classNames={{
          wrapper: "min-h-lvh bg-primary-foreground",
          layers:
            "flex min-h-lvh flex-col items-center justify-center px-4 py-[100px] md:py-[200px]",
          fade: "z-10",
        }}
        layers={[
          { layer: "1", yPercent: 70 },
          { layer: "2", yPercent: 50 },
          { layer: "3", yPercent: 30 },
        ]}
      >
        <ParallaxLayer
          layer="1"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-position-[center_center] bg-size-[70px_70px]"
        ></ParallaxLayer>

        <ParallaxLayer
          layer="2"
          className="-mt-[20vh] absolute inset-0 flex flex-col items-center justify-center gap-4 font-medium md:gap-8"
        >
          <div className="mx-4 inline-block max-w-3xl text-center text-xl md:text-3xl">
            whoever scrolls first gets{" "}
            <b className="inline-block rounded-lg border border-main/50 bg-accent px-2 py-1 backdrop-blur-[1.5px]">
              muddy
            </b>
            , like for real.
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          layer="4"
          className="absolute right-0 bottom-0 left-0 w-full"
        >
          <GrainGradient
            height={200}
            colors={["#D1D1D1"]}
            colorBack="#ffffff00"
            softness={0}
            intensity={0}
            noise={0}
            shape="wave"
            speed={1}
            scale={0.2}
            className="w-full invert-100 dark:invert-0"
          />
        </ParallaxLayer>
      </ParallaxScroll>
      <div className="flex w-full items-center justify-center py-40 text-center text-accent">
        <p className="max-w-2xl px-4 text-lg md:text-xl">
          idk it looks cool you shall scroll up and down to see the effect again
        </p>
      </div>
    </main>
  );
}
