import { clearGuestbookCache } from "@/lib/actions/guestbook";
import { clearLinkCache } from "@/lib/actions/dub";
import { validateAdminWorkflowAuth } from "@/lib/actions/admin-workflow";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authResult = await validateAdminWorkflowAuth(req);
  if (!authResult.authorized) {
    return authResult.response;
  }

  // Clear all caches
  const guestbookResult = await clearGuestbookCache();
  const linkResult = await clearLinkCache();

  return new Response(
    JSON.stringify({
      ok: true,
      results: {
        guestbook: guestbookResult,
        links: linkResult,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
