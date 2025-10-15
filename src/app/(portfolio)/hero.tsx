import HeroEnd from "./hero-end";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col">
      <div className="inner relative flex h-[80vh] flex-col justify-around border-separator/10 border-x border-t bg-[url(/static/images/vector/contour_dark.svg)] bg-cover bg-position-[center_top_24rem] bg-no-repeat px-4 *:transition-all sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:px-16 dark:bg-[url(/static/images/vector/contour_light.svg)]">
        <span className="flex flex-col *:transition-all lg:pb-64">
          <h1 className="font-medium font-montreal text-3xl sm:text-4xl lg:text-[2.5rem] lg:leading-14">
            hey, i&apos;m hexaa 👋
          </h1>
          <p className="max-w-[450px] font-sans text-xs leading-4 sm:text-sm lg:text-base lg:leading-5">
            a self-taught software engineer with a strong foundation in
            full-stack development, driven by a passion for building impactful
            solutions.
          </p>
        </span>
        <span className="flex w-full justify-center md:w-auto md:justify-end">
          <p className="w-full max-w-[350px] text-center font-montreal-mono text-muted-foreground text-xs sm:text-sm md:text-base lg:w-auto lg:pt-52 lg:text-end">
            &quot;a journey that began as a hobby and evolved into a deep
            commitment to technology and problem-solving.&quot;
          </p>
        </span>
      </div>
      <HeroEnd />
    </section>
  );
}
