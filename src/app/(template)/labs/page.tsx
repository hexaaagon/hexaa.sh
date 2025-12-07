import Star8 from "@/components/stars/s8";
import { Button } from "@/labs-registry/components-v1/button";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { ScrollText } from "@/components/ui/scroll-text";
import Link from "next/link";
import { StackedCards } from "@/components/stack-cards";
import { LightRays } from "@/components/ui/light-rays";

export default function LabsPage() {
  return (
    <main>
      <section className="flex h-screen max-h-208 flex-col items-center justify-center">
        <span className="relative text-center">
          <h1 className="font-bold text-5xl sm:text-7xl">
            Hexaa's <b className="font-montreal">La</b>
            <b className="font-serif">bs</b>
          </h1>
          <span className="absolute right-0 bottom-0 left-0 z-20 h-12 w-full bg-linear-to-b from-transparent to-background/70"></span>
        </span>
        <span className="mx-4 inline-block text-center text-xl sm:text-3xl">
          a{" "}
          <span className="relative bg-linear-to-br from-primary/20 to-primary/5 px-2">
            curated list
            <Star8 className="-top-4 -left-4 absolute z-30" size={32} />
            <Star8 className="-bottom-3 -right-3 absolute z-30" size={24} />
          </span>{" "}
          of Hexaa’s UI compounds.
        </span>
        <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:gap-3">
          <Button size="lg" variant="link" asChild>
            <Link href="/labs/get-started">[get started]</Link>
          </Button>
          <Button size="lg" variant="link" asChild>
            <Link href="/labs/components">[view components]</Link>
          </Button>
        </div>
      </section>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex border-separator/10 border-x">
          <div className="relative w-full overflow-clip px-6 py-8">
            <div className="absolute top-0 mx-auto h-12 w-2/3 rounded-2xl bg-primary blur-[18rem]" />
            <header className="font-normal leading-tight">
              <ScrollText text="Welcome to Hexaa's Labs, a curated collection of my personal experiments and UI compounds. Here, I explore innovative designs and functionalities that push the boundaries of user experience. Dive in to discover unique components that reflect my passion for creativity and technology." />
            </header>
          </div>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </section>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex border-separator/10 border-x">
          <div className="w-full">
            <StackedCards />
          </div>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </section>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex flex-col items-center justify-center border-separator/10 border-x py-24">
          <LightRays className="-z-10 absolute inset-0 flex items-center justify-center bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-position-[center_center] bg-size-[70px_70px]" />
          <div className="space-y-6 px-6 text-center">
            <h2 className="font-inter font-semibold text-3xl md:text-4xl">
              Make your components{" "}
              <b className="font-bold italic underline decoration-wavy">
                more unique
              </b>
              .
            </h2>
            <p className="mx-auto max-w-2xl text-xl">
              Explore Hexaa's Labs to find innovative UI compounds that can
              elevate your projects.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:gap-3">
            <Button size="lg" variant="link" asChild>
              <Link href="/labs/get-started">[get started]</Link>
            </Button>
            <Button size="lg" variant="link" asChild>
              <Link href="/labs/components">[view components]</Link>
            </Button>
          </div>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </section>
    </main>
  );
}
