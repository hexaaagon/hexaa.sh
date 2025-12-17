import { attributes } from "@/constants/portfolio/attribute";
import { HeaderBanner } from "./banner.client";
import { PlusSeparator } from "@/components/ui/plus-separator";

export default function ProjectsPage() {
  return (
    <main>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex h-16 gap-2 border-separator/10 border-x p-2"></div>
      </section>
      <HeaderBanner />
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative grid grid-cols-1 gap-x-2 gap-y-8 border-separator/10 border-x px-4 py-6 md:grid-cols-2">
          {attributes.map((attribute) => (
            <div key={attribute.name} className="space-y-4">
              <h3 className="font-semibold text-xl">{attribute.name}</h3>
              <ul className="space-y-2">
                {attribute.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium font-mono text-blue-600 transition-all hover:underline dark:text-blue-400"
                    >
                      [{link.label}]
                    </a>
                    {link.type === "showcase" && (
                      <p className="text-muted-foreground text-sm">
                        {link.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
        </div>
      </section>
    </main>
  );
}
