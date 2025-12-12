import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ReactLenis from "lenis/react";

//import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeMode } from "./theme-mode";

export function ThemeProvider({ children }: ComponentProps<"div">) {
  return (
    <>
      {/*<ViewTransitions>*/}
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeMode />
        <ReactLenis root>{children}</ReactLenis>
        <Toaster richColors expand />
      </NextThemesProvider>
      {/*</ViewTransitions>*/}

      <Analytics />
      <SpeedInsights />
    </>
  );
}
