import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Hackathon } from "@/content/portfolio/hackathons";
import Link from "next/link";

export function HackathonCard({
  title,
  description,
  dates,
  location,
  image,
  links,
  flags,
}: Hackathon) {
  return (
    <li className="relative ml-10 py-4">
      <div className="-left-16 absolute top-2 flex items-center justify-center rounded-full bg-white">
        <Avatar className="m-auto size-12 border">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        {dates && (
          <time className="text-muted-foreground text-xs">{dates}</time>
        )}
        <h2 className="font-semibold leading-none">
          {title}
          {flags?.includes("committee") && (
            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              Committee
            </Badge>
          )}
        </h2>
        {location && (
          <p className="text-muted-foreground text-sm">{location}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-muted-foreground text-sm">
            {description}
          </span>
        )}
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
          {links?.map((link, idx) => (
            <Link href={link.href} target="_blank" key={idx}>
              <Badge
                key={idx}
                title={link.title}
                className="flex gap-2"
                variant={link.variant || "default"}
              >
                {link.icon}
                {link.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}
