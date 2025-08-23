import { HeroNav } from "@/components/navbar";
import HeroEnd from "./hero-end";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90svh] flex-col">
      <div className="flex h-[80vh] flex-col justify-around *:transition-all lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-0">
        <span className="flex flex-col items-center text-center *:transition-all lg:items-end lg:pb-64 lg:text-right">
          <HeroNav>
            <h1 className="font-montreal text-3xl font-medium sm:text-4xl lg:text-[2.5rem] lg:leading-14">
              hey, i&apos;m hexaa 👋
            </h1>
            <p className="max-w-[450px] font-sans text-xs leading-4 sm:text-sm lg:text-base lg:leading-5">
              a self-taught software engineer with a strong foundation in
              full-stack development, driven by a passion for building impactful
              solutions.
            </p>
          </HeroNav>
        </span>
        <span>
          <p className="text-muted-foreground font-montreal-mono max-w-[300px] text-xs sm:text-sm lg:ml-8 lg:pt-52">
            &quot;a journey that began as a hobby and evolved into a deep
            commitment to technology and problem-solving.&quot;
          </p>
        </span>
      </div>
      <HeroEnd />
    </section>
  );
}
