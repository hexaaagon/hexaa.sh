import { OverlapCards } from "@/labs-registry/components-v1/card-overlap-scroll";

export default function CardOverlapScrollPage() {
  return (
    <div className="my-auto flex h-full w-full flex-col items-center justify-center py-16">
      <header className="mb-24 text-center">
        <h2 className="font-medium text-xl md:text-3xl">how to shower</h2>
        <p className="text-center text-muted-foreground text-sm md:text-lg">
          you dont shower in like 2 decades, so check this out
        </p>
      </header>
      <OverlapCards
        cards={[
          {
            description: "go to the bathroom (optional)",
          },
          {
            description: "turn on the water (optional)",
          },
          {
            description: "adjust the temperature if needed (i prefer it cold)",
          },
          {
            description: "get under the water (important)",
          },
          {
            description: "use soap or body wash to clean yourself (optional)",
          },
        ]}
        className="min-h-[800px] w-full bg-background"
      />
    </div>
  );
}
