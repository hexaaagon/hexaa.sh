import { PlusSeparator } from "@/components/ui/plus-separator";
import { GrainGradient } from "@paper-design/shaders-react";

export default function BlogPage() {
  return (
    <main className="mt-16">
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex border-separator/10 border-x">
          <PlusSeparator
            position={["top-left", "top-right", "bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
          <GrainGradient
            height={250}
            colors={["#c6750c", "#beae60", "#d7cbc6"]}
            colorBack="#ffffff00"
            softness={0.7}
            intensity={0.15}
            noise={0.5}
            shape="wave"
            speed={0.7}
            scale={2.5}
            offsetX={1}
            offsetY={0.6}
            className="w-full bg-background/20"
          />
          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
            <div className="mt-12 ml-10 flex h-full flex-col">
              <h2 className="text-4xl">hexaa's blog.</h2>
              <p>here goes another yap and yap</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex border-separator/10 border-x"></div>
      </section>
    </main>
  );
}
