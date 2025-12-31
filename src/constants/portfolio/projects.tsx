import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";

export interface ProjectItem {
  title: string;
  description: string;
  imageId: string;
  badge: ReactElement[];
  link?: string;
  // blogLink?: string;
  repo: string;
  unmaintained?: boolean;
}

const url = process.env.BETTER_AUTH_URL || "https://hexaa.sh/";
export const projectsData: ProjectItem[] = [
  {
    title: "Hack Club Merch",
    description:
      "Build your own projects, get cool swags. A YSWS (You Ship We Ship) program by Hack Club.",
    imageId: "/hack-club-merch.png",
    badge: [
      <Badge key="YSWS">YSWS</Badge>,
      <Badge key="draft">Draft</Badge>,
      <Badge key="hack-club">Hack Club</Badge>,
    ],
    link: `${url}/merch?utm_source=personal_website`,
    repo: "https://github.com/hexaaagon/hackclub-merch",
  },
  {
    title: "Hack Club Hackography",
    description:
      "Build a photo filter effect, get a professional camera for free. A YSWS (You Ship We Ship) program by Hack Club.",
    imageId: "/hack-club-hackography.png",
    badge: [
      <Badge key="YSWS">YSWS</Badge>,
      <Badge key="draft">Draft</Badge>,
      <Badge key="hack-club">Hack Club</Badge>,
    ],
    link: `${url}/hackography?utm_source=personal_website`,
    repo: `https://github.com/hexaaagon/hackclub-hackography`,
    unmaintained: true,
  },
  {
    title: "Wackanel",
    description:
      "A serverless site that lets you mirror multiple Wakatime and Wakapis instances with a backup system.",
    imageId: "/wackanel.webp",
    badge: [
      <Badge key="personal">Personal</Badge>,
      <Badge key="wakatime">Wakatime</Badge>,
      <Badge key="hackatime">Hackatime</Badge>,
    ],
    link: `${url}/wackanel?utm_source=personal_website`,
    repo: "https://github.com/hexaaagon/wackanel",
    unmaintained: true,
  },
  {
    title: "Pastebon",
    description:
      "A simple, fast, and free pastebin alternative that pastes your code anonymously.",
    imageId: "/pastebon.png",
    badge: [
      <Badge key="personal">Personal</Badge>,
      <Badge key="pastebin">Pastebin</Badge>,
    ],
    link: `${url}/pastebon?utm_source=personal_website`,
    repo: "https://github.com/hexaaagon/pastebon",
  },
  {
    title: "simple-chatbot",
    description:
      "Just a simple llm-powered chatbot using Cloudflare AI for future testing purposes.",
    imageId: "/simple-chatbot.png",
    badge: [
      <Badge key="personal">Personal</Badge>,
      <Badge key="chatbot">Chatbot</Badge>,
    ],
    link: `${url}/simple-chatbot?utm_source=personal_website`,
    repo: "https://github.com/hexaaagon/simple-chatbot",
  },
  {
    title: "Claisse",
    description:
      "An educational platform that utilize AI for making automated quiz based on the student perference of study and their study interest.",
    imageId: "/claisse.png",
    badge: [
      <Badge key="hackathon">Hackathon</Badge>,
      <Badge key="garuda-hacks">Garuda Hacks 6.0</Badge>,
      <Badge key="education">Education</Badge>,
    ],
    link: `${url}/claisse?utm_source=personal_website`,
    repo: "https://github.com/hexaaagon/claisse",
    unmaintained: true,
  },
];
