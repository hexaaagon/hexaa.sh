import { getPostHogServer } from "../posthog.server";

/**
 * Track authentication events in PostHog (server-side)
 */
export async function trackAuthEvent(
  eventType: "user_signed_up" | "user_signed_in" | "user_signed_out",
  data?: {
    method?: "email" | "github" | "discord";
    userId?: string;
    email?: string;
    name?: string;
    image?: string;
    createdAt?: string;
  },
) {
  // Only run on server-side
  if (typeof window !== "undefined") return;

  const posthog = getPostHogServer();

  if (eventType === "user_signed_out") {
    if (data?.userId) {
      posthog.capture({
        distinctId: data.userId,
        event: "user_signed_out",
      });
      await posthog.flush();
    }
    return;
  }

  if (!data?.userId) return;

  // Capture the authentication event with properties
  posthog.capture({
    distinctId: data.userId,
    event: eventType,
    properties: {
      method: data.method,
      $set: {
        email: data.email,
        name: data.name,
        image: data.image,
      },
      // Use $set_once for properties that don't change
      $set_once: {
        createdAt: data.createdAt,
        signupMethod: eventType === "user_signed_up" ? data.method : undefined,
      },
    },
  });

  // Identify the user with their properties
  posthog.identify({
    distinctId: data.userId,
    properties: {
      email: data.email,
      name: data.name,
      image: data.image,
    },
  });

  // Flush events to ensure they're sent
  await posthog.flush();
}

/**
 * Identify user in PostHog when session is restored (server-side)
 */
export async function identifyUser(
  session: {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      createdAt: Date;
    };
  } | null,
) {
  // Only run on server-side
  if (typeof window !== "undefined" || !session?.user) return;

  const posthog = getPostHogServer();

  posthog.identify({
    distinctId: session.user.id,
    properties: {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      createdAt: session.user.createdAt,
    },
  });

  await posthog.flush();
}

/**
 * Track authentication errors in PostHog (server-side)
 */
export async function trackAuthError(
  error: Error,
  errorType:
    | "signup_failed"
    | "signin_failed"
    | "signout_failed"
    | "session_error"
    | "oauth_error",
  context?: {
    method?: "email" | "github" | "discord";
    userId?: string;
    email?: string;
  },
) {
  // Only run on server-side
  if (typeof window !== "undefined") return;

  const posthog = getPostHogServer();
  const distinctId = context?.userId || context?.email || "anonymous";

  // Capture custom auth error event
  posthog.capture({
    distinctId,
    event: "auth_error",
    properties: {
      error_type: errorType,
      error_message: error.message,
      error_name: error.name,
      method: context?.method,
      email: context?.email,
    },
  });

  // Also capture as exception for PostHog's error tracking
  posthog.capture({
    distinctId,
    event: "$exception",
    properties: {
      $exception_type: error.name || "AuthError",
      $exception_message: error.message,
      $exception_stack_trace_raw: error.stack,
      $exception_level: "error",
      auth_error_type: errorType,
      auth_method: context?.method,
    },
  });

  await posthog.flush();
}
