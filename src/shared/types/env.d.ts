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

      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      TURNSTILE_SITE_KEY: string;
      TURNSTILE_SECRET_KEY: string;

      // Vercel-provided system vars
      VERCEL_ENV: "production" | "preview" | "development";
      VERCEL_TARGET_ENV: string;
      VERCEL_URL: string;
      VERCEL_BRANCH_URL: string;
      VERCEL_PROJECT_PRODUCTION_URL: string;
      VERCEL_REGION: string;
      VERCEL_DEPLOYMENT_ID: string;
      VERCEL_PROJECT_ID: string;
      VERCEL_AUTOMATION_BYPASS_SECRET?: string;

      // Git metadata
      VERCEL_GIT_PROVIDER: "github" | "gitlab" | "bitbucket";
      VERCEL_GIT_REPO_SLUG: string;
      VERCEL_GIT_REPO_OWNER: string;
      VERCEL_GIT_REPO_ID: string;
      VERCEL_GIT_COMMIT_REF: string;
      VERCEL_GIT_COMMIT_SHA: string;
      VERCEL_GIT_COMMIT_MESSAGE: string;
      VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
      VERCEL_GIT_COMMIT_AUTHOR_NAME: string;
      VERCEL_GIT_PREVIOUS_SHA?: string;
      VERCEL_GIT_PULL_REQUEST_ID?: string;
    }
  }
}
