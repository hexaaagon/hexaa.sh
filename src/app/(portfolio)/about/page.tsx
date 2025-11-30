import { PlusSeparator } from "@/components/ui/plus-separator";
import { HeaderBanner } from "./banner.client";
import { AnimatedBackground } from "@/components/animated-background";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { techStacks } from "@/content/portfolio/about";
import SocialBento from "@/components/social-bento";
import { getGithubContributions } from "@/lib/portfolio/social";

export default async function AboutSection() {
  const githubContributions = await getGithubContributions();
  return (
    <main>
      <section className="w-full border-separator/10 border-y">
        <div className="inner relative flex h-16 gap-2 border-separator/10 border-x"></div>
      </section>
      <HeaderBanner />
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex h-16 gap-2 border-separator/10 border-x">
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
        </div>
      </section>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex gap-2 border-separator/10 border-x p-4">
          <div className="grid w-full lg:grid-cols-2">
            <AnimatedBackground
              className="-z-50 w-full rounded-lg bg-primary/5"
              transition={{
                bounce: 0,
                type: "spring",
                duration: 0.3,
                from: 50,
              }}
              enableHover
            >
              {techStacks.map((item, index) => (
                <Link
                  aria-label="Skills Link"
                  key={item.name}
                  data-id={`card-${index}`}
                  href={`${item.link}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="block"
                >
                  <div className="group flex cursor-pointer items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-8">
                      <item.icon
                        className="font-medium text-3xl text-zeta tracking-tight transition-colors duration-300 group-hover:text-foreground"
                        aria-hidden="true"
                      />

                      <span className="font-medium text-lg text-zeta tracking-tight transition-colors duration-300 group-hover:text-foreground">
                        {item.name}
                      </span>
                    </div>

                    <ArrowRight className="ml-4 h-5 w-5 transition-colors duration-300 group-hover:text-foreground" />
                  </div>
                </Link>
              ))}
            </AnimatedBackground>
          </div>
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
        </div>
      </section>
      <section className="w-full">
        <div className="inner relative flex gap-2 border-separator/10 border-x px-2 py-3">
          <SocialBento githubContributions={githubContributions ?? undefined} />
        </div>
      </section>
    </main>
  );
}
