export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
    }
  }
}
