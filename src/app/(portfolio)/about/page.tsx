import { PlusSeparator } from "@/components/ui/plus-separator";
import { HeaderBanner } from "./banner.client";
import { AnimatedBackground } from "@/components/animated-background";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { contacts, techStacks } from "@/content/portfolio/about";
import SocialBento from "@/components/social-bento";
import { getGithubContributions } from "@/lib/portfolio/social";
import { HackathonCard } from "@/components/hackathon-card";
import { hackathons } from "@/content/portfolio/hackathons";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AboutSection() {
  const githubContributions = await getGithubContributions();
  return (
    <main>
      <section className="w-full border-separator/10 border-y">
        <div className="inner relative flex h-16 gap-2 border-separator/10 border-x"></div>
      </section>
      <HeaderBanner />
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex flex-col items-center gap-8 border-separator/10 border-x px-8 pt-10 pb-8 xl:flex-row">
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
          <div className="w-full">
            <Skeleton className="h-96"></Skeleton>
          </div>
          <div className="xl:max-w-3/5">
            <span className="relative">
              <h4 className="font-medium text-xl">hey there, hexaa's here.</h4>
              <div className="absolute bottom-0 h-4 w-full bg-linear-to-b from-transparent to-background/60" />
            </span>
            <p className="text-sm leading-relaxed md:text-base">
              started programming at 10 years old by creating a simple project,
              which i found fun and sparked my journey as a bot developer. when
              i was 14, i found a community called hack club, where i learned
              much more about programming. hack club also gave me opportunities
              to organize events and meet new people. from that time, i finally
              tried an in-person hackathon with other hack clubbers, and it was,
              very fun! now, i'm a self-taught software engineer who loves
              building things with code and constantly improving my skills.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex-col border-separator/10 border-x px-4 py-12">
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
          <span className="relative">
            <h2 className="mb-6 text-center font-medium text-4xl">
              Hackathon attended so far
            </h2>
            <div className="absolute bottom-0 h-8 w-full bg-linear-to-b from-transparent to-background/40" />
          </span>
          <ul className="mb-4 ml-8 w-full divide-y divide-dashed border-l">
            {hackathons.map((hackathon, idx) => (
              <HackathonCard
                key={idx}
                title={hackathon.title}
                description={hackathon.description}
                location={hackathon.location}
                dates={hackathon.dates}
                image={hackathon.image}
                links={hackathon.links}
                flags={hackathon.flags}
              />
            ))}
          </ul>
        </div>
      </section>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex gap-2 border-separator/10 border-x p-4">
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
          <div className="grid w-full lg:grid-cols-2">
            {/* Split techStacks into two halves */}
            {(() => {
              const stacks = Array.isArray(techStacks) ? techStacks : [];
              const half = Math.ceil(stacks.length / 2);
              const firstHalf = stacks.slice(0, half);
              const secondHalf = stacks.slice(half);
              return (
                <>
                  <div>
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
                      {firstHalf.map((item, index) => (
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
                  <div>
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
                      {secondHalf.map((item, index) => (
                        <Link
                          aria-label="Skills Link"
                          key={item.name}
                          data-id={`card-${half + index}`}
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
                </>
              );
            })()}
          </div>
        </div>
      </section>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex flex-col items-center gap-2 border-separator/10 border-x px-5 py-8">
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
          <span className="relative">
            <h2 className="text-center font-medium text-2xl">
              wanna talk? or just finding me around?
            </h2>
            <div className="absolute bottom-0 h-8 w-full bg-linear-to-br from-transparent to-background/80" />
          </span>
          <div className="flex w-full flex-col items-center space-y-2">
            <AnimatedBackground
              className="-z-50 w-full rounded-lg bg-primary/3"
              transition={{
                bounce: 0,
                type: "spring",
                duration: 0.3,
                from: 50,
              }}
              enableHover
            >
              {contacts.map((item, index) => (
                <Link
                  className="block w-full rounded-full border-[0.5px] border-separator/20 border-dashed px-5 pt-2 pb-1 md:w-2/5"
                  data-id={`contact-card-${index}`}
                  key={item.name}
                  href={item.link}
                  target="_blank"
                >
                  <span className="flex w-full items-center justify-between text-sm">
                    <p className="inline-flex items-center gap-2 font-mono tracking-tight">
                      <item.icon size={18} /> {item.name}
                    </p>
                    <p className="text-muted-foreground">{item.contact}</p>
                  </span>
                </Link>
              ))}
            </AnimatedBackground>
            <div className="pointer-events-none absolute inset-0 h-full w-full overflow-clip">
              <div className="pointer-events-none absolute bottom-0 left-0 h-14 w-1/8 min-w-18 bg-muted-foreground blur-[250px]"></div>
              <div className="pointer-events-none absolute right-0 bottom-0 h-14 w-1/8 min-w-18 bg-muted-foreground blur-[250px]"></div>
            </div>
          </div>
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
