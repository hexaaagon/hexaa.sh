import { type LucideIcon, Mail } from "lucide-react";
import {
  type IconType,
  SiBun,
  SiDiscord,
  SiDrizzle,
  SiFigma,
  SiHackclub,
  SiHono,
  SiNotion,
  SiPostgresql,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";

export type InfoCard = {
  name: string;
  icon: IconType | LucideIcon;
  link: string;
};

export const techStacks: InfoCard[] = [
  {
    name: "Bun",
    icon: SiBun,
    link: "https://bun.sh/",
  },
  {
    name: "Typescript",
    icon: SiTypescript,
    link: "https://www.typescriptlang.org",
  },
  {
    name: "Drizzle ORM",
    icon: SiDrizzle,
    link: "https://orm.drizzle.team/",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    link: "https://www.postgresql.org/",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    link: "https://tailwindcss.com",
  },
  {
    name: "Hono",
    icon: SiHono,
    link: "https://hono.dev",
  },
  {
    name: "Notion",
    icon: SiNotion,
    link: "https://www.notion.com",
  },
  {
    name: "Figma",
    icon: SiFigma,
    link: "https://www.figma.com",
  },
];

export const contacts: (InfoCard & {
  contact: string;
})[] = [
  {
    name: "hack_club",
    contact: "Hexaa",
    icon: SiHackclub,
    link: "https://hackclub.enterprise.slack.com/team/U082WTQLCVA",
  },
  {
    name: "email",
    contact: "me@hexagonn.my.id",
    icon: Mail,
    link: "mailto:me@hexagonn.my.id",
  },
  {
    name: "discord",
    contact: "@scoooolzs",
    icon: SiDiscord,
    link: "https://discord.com/users/465454937267240962",
  },
];
