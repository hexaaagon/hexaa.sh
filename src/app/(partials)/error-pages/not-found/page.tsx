import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center">
      <p>404 - no page found</p>
      <Link
        className="font-mono text-sky-700 transition-all hover:underline sm:text-sm dark:text-sky-600"
        href="/"
      >
        [go back?]
      </Link>
    </main>
  );
}
