import { clearGuestbookCache } from "@/lib/actions/guestbook";
import { validateAdminWorkflowAuth } from "@/lib/actions/admin-workflow";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authResult = await validateAdminWorkflowAuth(req);
  if (!authResult.authorized) {
    return authResult.response;
  }

  const result = await clearGuestbookCache();

  return new Response(JSON.stringify({ ok: true, ...result }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
