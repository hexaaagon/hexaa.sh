import Hero from "./hero";
import SocialCard from "./about-social";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="flex flex-col items-center justify-center py-18">
        <h1 className="text-3xl font-medium">
          This website isn&apos;t ready yet.
        </h1>
        <p className="text-center">
          In the meantime, you can check out my{" "}
          <Link
            href="https://hexagonn.my.id"
            className="text-blue-500 hover:underline"
          >
            old website
          </Link>{" "}
          instead.
        </p>
      </div>
    </main>
  );
}
