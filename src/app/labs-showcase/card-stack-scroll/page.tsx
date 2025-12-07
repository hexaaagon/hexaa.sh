import { StackedCards } from "@/labs-registry/components-v1/card-stack-scroll";

export default function CardStackScrollPage() {
  return (
    <div className="my-auto flex h-full w-full flex-col items-center justify-center py-16">
      <header className="mb-24 text-center">
        <h2 className="font-medium text-xl md:text-3xl">
          The reason why i love you
        </h2>
        <p className="text-center text-muted-foreground text-sm md:text-lg">
          idk but you should check this out
        </p>
      </header>
      <StackedCards
        cardData={[
          {
            id: 1,
            title: "i'm cool",
            description: "real real real real",
            color: "rgba(0, 214, 150, 0.1)",
          },
          {
            id: 2,
            title: "i'm awuuuuuu",
            description:
              "baby i'm preyin' on you tonight hunt you down eat you alive just like animals animals like animals ooh",
            color: "rgba(236, 55, 80, 0.1)",
          },
          {
            id: 3,
            title: "i'm epic",
            description: "i'm so epic fr no cap no flex just facts",
            color: "rgba(59, 130, 246, 0.1)",
          },
        ]}
      />
    </div>
  );
}
