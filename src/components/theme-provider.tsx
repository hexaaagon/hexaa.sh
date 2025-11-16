import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ReactLenis from "lenis/react";

//import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { Toaster } from "@/components/ui/sonner";

export function ThemeProvider({ children }: ComponentProps<"div">) {
  return (
    <>
      {/*<ViewTransitions>*/}
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <ReactLenis root>{children}</ReactLenis>
        <Toaster richColors expand />
        <SmoothCursor disableRotation />
      </NextThemesProvider>
      {/*</ViewTransitions>*/}

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
