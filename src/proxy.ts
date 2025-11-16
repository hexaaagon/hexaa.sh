import { NextResponse } from "next/server";
import type { NextRequest, ProxyConfig } from "next/server";
import type { LinkSchema } from "dub/models/components";
import { isDefinedRoute } from "./generated/routes";
import { betterFetch } from "@better-fetch/fetch";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/^\//, "");

  if (
    pathname.startsWith("_next") ||
    pathname.startsWith("api/") ||
    pathname.startsWith("static/") ||
    pathname === "favicon.ico" ||
    pathname === ""
  ) {
    return NextResponse.next();
  }

  // skip if this is a defined Next.js route (including dynamic routes)
  if (isDefinedRoute(pathname)) {
    return NextResponse.next();
  }

  try {
    const dubResponse = await betterFetch(
      `https://api.dub.co/links/info?domain=go.hexaa.sh&key=${pathname}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DUB_API_KEY}`,
        },
      },
    );

    if (!dubResponse.data) {
      return NextResponse.next();
    }

    const linkData = dubResponse.data as LinkSchema;

    if (linkData?.url) {
      const searchParams = request.nextUrl.searchParams;
      const dubSearchParams = new URLSearchParams();

      // add referrer tracking if no utm_source exists
      const referer = request.headers.get("referer");
      if (referer && !searchParams.has("utm_source")) {
        try {
          const refererUrl = new URL(referer);
          dubSearchParams.set("utm_source", refererUrl.hostname);
          dubSearchParams.set("utm_medium", "referral");
          dubSearchParams.set("ref", referer);
        } catch {
          dubSearchParams.set("ref", referer);
        }
      }

      // add existing UTM parameters from the request to dubSearchParams
      const utmParams = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ];
      utmParams.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          dubSearchParams.set(param, value);
        }
      });

      const redirectParams = new URLSearchParams(searchParams);
      redirectParams.set(
        "url",
        `${linkData.shortLink}?${dubSearchParams.toString()}`,
      );
      redirectParams.set("origin_url", linkData.url);
      redirectParams.set("key", pathname);

      if (linkData.title) {
        redirectParams.set("title", linkData.title);
      }
      if (linkData.description) {
        redirectParams.set("description", linkData.description);
      }
      // Only include image if it's a valid HTTP(S) URL, not base64
      if (linkData.image && /^https?:\/\//i.test(linkData.image)) {
        redirectParams.set("image", linkData.image);
      }

      const response = NextResponse.redirect(
        `${request.nextUrl.origin}/dub-redirect?${redirectParams.toString()}`,
      );

      return response;
    }
  } catch (error) {
    console.error("Error checking Dub link:", error);
  }

  // Let it fall through to the 404 page
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
