import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  badge: ReactElement[];
  link?: string;
  // blogLink?: string;
  repo: string;
  unmaintained?: boolean;
}

export const projectsData: ProjectItem[] = [
  {
    title: "Hack Club Merch",
    description:
      "Build your own projects, get cool swags. A YSWS (You Ship We Ship) program by Hack Club.",
    image: "/static/images/projects/hack-club-merch.png",
    badge: [
      <Badge key="YSWS">YSWS</Badge>,
      <Badge key="draft">Draft</Badge>,
      <Badge key="hack-club">Hack Club</Badge>,
    ],
    link: "https://hexaa.sh/merch",
    repo: "https://github.com/hexaaagon/hackclub-merch",
  },
  {
    title: "Hack Club Hackography",
    description:
      "Build a photo filter effect, get a professional camera for free. A YSWS (You Ship We Ship) program by Hack Club.",
    image: "/static/images/projects/hack-club-hackography.png",
    badge: [
      <Badge key="YSWS">YSWS</Badge>,
      <Badge key="draft">Draft</Badge>,
      <Badge key="hack-club">Hack Club</Badge>,
    ],
    link: "https://hexaa.sh/hackography",
    repo: "https://hexaa.sh/hackography",
    unmaintained: true,
  },
  {
    title: "Claisse",
    description:
      "An educational platform that utilize AI for making automated quiz based on the student perference of study and their study interest.",
    image: "/static/images/projects/claisse.png",
    badge: [
      <Badge key="hackathon">Hackathon</Badge>,
      <Badge key="garuda-hacks">Garuda Hacks 6.0</Badge>,
      <Badge key="education">Education</Badge>,
    ],
    link: "https://claisse.hexaa.sh",
    repo: "https://github.com/hexaaagon/claisse",
    unmaintained: true,
  },
  {
    title: "Pastebon",
    description:
      "A simple, fast, and free pastebin alternative that pastes your code anonymously.",
    image: "/static/images/projects/pastebon.png",
    badge: [
      <Badge key="personal">Personal</Badge>,
      <Badge key="pastebin">Pastebin</Badge>,
    ],
    link: "https://pastebon.hexaa.lol",
    repo: "https://github.com/hexaaagon/pastebon",
  },
  {
    title: "simple-chatbot",
    description:
      "Just a simple llm-powered chatbot using Cloudflare AI for future testing purposes.",
    image: "/static/images/projects/simple-chatbot.png",
    badge: [
      <Badge key="personal">Personal</Badge>,
      <Badge key="chatbot">Chatbot</Badge>,
    ],
    link: "https://simple-chatbot.scb-b72.workers.dev/",
    repo: "https://github.com/hexaaagon/simple-chatbot",
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
    link: "https://wackanel.hexaa.sh",
    repo: "https://github.com/hexaaagon/wackanel",
    unmaintained: true,
  },
];
