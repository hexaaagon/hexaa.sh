"use client";
import { motion } from "motion/react";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LinkSchema } from "dub/models/components";

interface DubRedirectCardProps {
  data: LinkSchema;
  className?: string;
}

export function DubRedirectCard({ data, className }: DubRedirectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800",
        "bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-neutral-900",
        className,
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
        {data.image ? (
          // biome-ignore lint/performance/noImgElement: <explanation>
          <img
            src={data.image}
            alt={data.title || "Link preview"}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <LinkIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-3 p-6">
        {/* Title */}
        <h3 className="line-clamp-2 font-semibold text-lg text-neutral-900 md:text-xl dark:text-neutral-100">
          <LinkIcon className="mr-2 inline-block h-5 w-5" />
          {data.title || "Untitled Link"}
        </h3>

        {/* Description */}
        {data.description && (
          <p className="line-clamp-3 text-neutral-600 text-xs md:text-sm dark:text-neutral-400">
            {data.description}
          </p>
        )}

        {/* URL Section */}
        <div className="border-neutral-200 border-t pt-2 dark:border-neutral-800">
          <p className="w-full truncate rounded-md bg-muted p-2 px-4 font-mono text-xs">
            {data.url}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
