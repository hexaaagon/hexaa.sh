import { labs as source } from "@/lib/source";

import buttonImage from "#/static/images/labs/button.png";
import cardOverlapScrollImage from "#/static/images/labs/card-overlap-scroll.png";
import cardStackScrollImage from "#/static/images/labs/card-stack-scroll.png";
import parallaxScrollImage from "#/static/images/labs/parallax-scroll.png";
import rotateVelocityScrollImage from "#/static/images/labs/rotate-velocity-scroll.png";
import smoothCursorImage from "#/static/images/labs/smooth-cusor.png";
import trailingScrollImage from "#/static/images/labs/trailing-scroll.png";
import Image from "next/image";
import Link from "next/link";

export const labComponents = [
  {
    id: "button",
    image: buttonImage,
  },
  {
    id: "card-overlap-scroll",
    image: cardOverlapScrollImage,
  },
  {
    id: "card-stack-scroll",
    image: cardStackScrollImage,
  },
  {
    id: "parallax-scroll",
    image: parallaxScrollImage,
  },
  {
    id: "rotate-velocity-scroll",
    image: rotateVelocityScrollImage,
  },
  {
    id: "smooth-cursor",
    image: smoothCursorImage,
  },
  {
    id: "trailing-scroll",
    image: trailingScrollImage,
  },
];

export function ComponentsShowcase() {
  return (
    <main className="not-prose relative grid grid-cols-1 gap-2 lg:grid-cols-2">
      {source.pageTree.children.map((item) => {
        if (item.$id !== "root:components" || item.type !== "folder")
          return null;

        return item.children.map((component) => {
          if (component.type !== "page") return null;

          const labComponent = labComponents.find(
            (c) => c.id === component.$id?.split("/")[1].replaceAll(".mdx", ""),
          );
          if (!labComponent) return null;

          return (
            <Link
              key={component.$id}
              href={component.url}
              className="group relative block h-96 overflow-hidden rounded-3xl border border-separator/10 bg-background shadow-sm transition-all hover:border-foreground/20"
            >
              <Image
                src={labComponent.image}
                alt={component.type}
                fill
                className="max-h-full w-full object-cover opacity-0 blur-[3px] transition duration-400 group-hover:opacity-80"
              />
              <Image
                src={labComponent.image}
                alt={component.type}
                fill
                className="group-hover:-translate-y-5 z-10 max-h-full w-full border object-cover transition-[scale,filter,translate,border-radius,opacity] duration-500 group-hover:scale-75 group-hover:rounded-2xl group-hover:opacity-100 group-hover:blur-none sm:opacity-40 sm:blur-[2px]"
              />
              <div className="absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-background/80 to-background/0 px-6 pb-4">
                <h2 className="font-semibold text-foreground/60 text-xl transition-[color] group-hover:text-foreground">
                  {component.name}
                </h2>
              </div>
            </Link>
          );
        });
      })}
    </main>
  );
}
