import type { ReactElement } from "react";
import type { StaticImageData } from "next/image";
import { Badge } from "@/components/ui/badge";

import hackClubMerchImage from "#/static/images/projects/hack-club-merch.png";
import hackClubHackographyImage from "#/static/images/projects/hack-club-hackography.png";
import pastebonImage from "#/static/images/projects/pastebon.png";
import simpleChatbotImage from "#/static/images/projects/simple-chatbot.png";
import claisseImage from "#/static/images/projects/claisse.png";

export interface ProjectItem {
  title: string;
  description: string;
  image: StaticImageData | string;
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
    image: hackClubMerchImage,
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
    image: hackClubHackographyImage,
    badge: [
      <Badge key="YSWS">YSWS</Badge>,
      <Badge key="draft">Draft</Badge>,
      <Badge key="hack-club">Hack Club</Badge>,
    ],
    link: `${url}/hackography?utm_source=personal_website`,
    repo: `${url}/hackography`,
    unmaintained: true,
  },
  {
    title: "Wackanel",
    description:
      "A serverless site that lets you mirror multiple Wakatime and Wakapis instances with a backup system.",
    image: "/static/images/projects/wackanel.gif",
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
    image: pastebonImage,
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
    image: simpleChatbotImage,
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
    image: claisseImage,
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
