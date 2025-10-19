"use server";
import { headers } from "next/headers";
import { ipAddress } from "@vercel/functions";

const verifyEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const secret = process.env.TURNSTILE_SECRET_KEY as string;

export async function verifyTurnstileToken(token: string, remoteip?: string) {
  const headersList = await headers();
  const ip = remoteip || ipAddress(headersList);

  const res = await fetch(verifyEndpoint, {
    method: "POST",
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}${ip ? `&remoteip=${encodeURIComponent(ip)}` : ""}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  const data = await res.json();

  return data.success as boolean;
}
