import { formatDate } from "@/lib/utils";
import type { ReactNode } from "react";

// Types
interface ChangelogProps {
  version?: string;
  date: string;
  badges?: string[];
  children: ReactNode;
}

interface ChangelogTitleProps {
  children: ReactNode;
}

interface ChangelogDescriptionProps {
  children: ReactNode;
}

interface ChangelogAccordionProps {
  title: string;
  children: ReactNode;
}

interface ChangelogProviderProps {
  children: ReactNode;
}

// Main container for changelogs
export function ChangelogProvider({ children }: ChangelogProviderProps) {
  return (
    <div className="not-prose mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <div className="relative">{children}</div>
    </div>
  );
}

// Individual changelog entry
export function Changelog({ version, date, badges, children }: ChangelogProps) {
  const parsedDate = new Date(date);
  const formattedDate = formatDate(parsedDate);

  return (
    <div className="relative">
      <div className="flex flex-col gap-y-6 md:flex-row">
        {/* Left side - Date and Version */}
        <div className="flex-shrink-0 md:w-48">
          <div className="pb-10 md:sticky md:top-24">
            <time className="mb-3 block font-medium text-muted-foreground text-sm">
              {formattedDate}
            </time>

            {version && (
              <div className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border font-bold text-foreground text-sm">
                {version}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Content */}
        <div className="relative flex-1 pb-10 md:pl-8">
          {/* Vertical timeline line */}
          <div className="absolute top-2 left-0 hidden h-full w-px bg-border md:block">
            {/* Timeline dot */}
            <div className="-translate-x-1/2 absolute z-10 hidden size-3 rounded-full bg-primary md:block" />
          </div>

          <div className="space-y-6">
            <div className="relative z-10 flex flex-col gap-2">
              {/* Badges */}
              {badges && badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge: string) => (
                    <span
                      key={badge}
                      className="flex h-6 w-fit items-center justify-center rounded-full border bg-muted px-2 font-medium text-muted-foreground text-xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Changelog title
export function ChangelogTitle({ children }: ChangelogTitleProps) {
  return (
    <h2 className="text-balance font-semibold text-2xl tracking-tight">
      {children}
    </h2>
  );
}

// Changelog description
export function ChangelogDescription({ children }: ChangelogDescriptionProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:text-balance prose-p:text-balance prose-headings:font-semibold prose-headings:tracking-tight prose-p:tracking-tight prose-a:no-underline">
      {children}
    </div>
  );
}
