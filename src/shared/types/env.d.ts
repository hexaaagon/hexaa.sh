export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      DATABASE_URL_UNPOOLED: string;
      PGHOST: string;
      PGHOST_UNPOOLED: string;
      PGUSER: string;
      PGDATABASE: string;
      PGPASSWORD: string;
      NEXT_PUBLIC_STACK_PROJECT_ID: string;
      NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: string;
      STACK_SECRET_SERVER_KEY: string;
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;

      // Auth
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: string;
      TURNSTILE_SECRET_KEY: string;

      // Dub.co
      DUB_API_KEY: string;

      // Hexaa's Thingy
      WORKFLOW_PASSWORD_HASH: string;

      // Last.fm API
      LASTFM_API_KEY: string;
      LASTFM_API_SECRET: string;
      LASTFM_USERNAME: string;

      // WakaTime API
      WAKATIME_API_KEY: string;

      // Vercel-provided system vars
      NEXT_PUBLIC_VERCEL_ENV: "production" | "preview" | "development";
      NEXT_PUBLIC_VERCEL_TARGET_ENV: string;
      NEXT_PUBLIC_VERCEL_URL: string;
      NEXT_PUBLIC_VERCEL_BRANCH_URL: string;
      NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: string;
      NEXT_PUBLIC_VERCEL_REGION: string;
      NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID: string;
      NEXT_PUBLIC_VERCEL_PROJECT_ID: string;
      NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET?: string;

      // Git metadata
      NEXT_PUBLIC_VERCEL_GIT_PROVIDER: "github" | "gitlab" | "bitbucket";
      NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG: string;
      NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER: string;
      NEXT_PUBLIC_VERCEL_GIT_REPO_ID: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME: string;
      NEXT_PUBLIC_VERCEL_GIT_PREVIOUS_SHA?: string;
      NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID?: string;
    }
  }
}
