import Link from "next/link";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function PageServerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
    posthog.capture("server_error", {
      ...error,
      $exception: true,
    });
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center">
      <p>??? - internal server error</p>
      <p>a dispatch will be sent immediately.</p>
      <Link
        className="font-mono text-sky-700 transition-all hover:underline sm:text-sm dark:text-sky-600"
        href="/"
      >
        [go back?]
      </Link>
    </main>
  );
}
