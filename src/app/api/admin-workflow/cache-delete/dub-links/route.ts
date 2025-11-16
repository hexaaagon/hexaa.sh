import { clearLinkCache } from "@/lib/actions/dub";
import { validateAdminWorkflowAuth } from "@/lib/actions/admin-workflow";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authResult = await validateAdminWorkflowAuth(req);
  if (!authResult.authorized) {
    return authResult.response;
  }

  await clearLinkCache();

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
