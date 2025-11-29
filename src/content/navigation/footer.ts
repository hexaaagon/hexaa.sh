import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { AtSign } from "lucide-react";

export const socials = [
  {
    name: "Email",
    href: "mailto:me@hexagonn.my.id",
    icon: AtSign,
  },
  {
    name: "GitHub",
    href: "https://github.com/hexaaagon",
    icon: SiGithub,
  },
  {
    name: "X (Twitter)",
    href: "https://twitter.com/Scoooolzs",
    icon: SiX,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hxgn.scoooolzs",
    icon: SiInstagram,
  },
];

export const pages = {
  personal: [
    { name: "blog", href: "/blog" },
    { name: "about me", href: "/about" },
    { name: "projects", href: "/projects" },
  ],
  explore: [
    { name: "home", href: "/" },
    { name: "guestbook", href: "/guestbook" },
  ],
  meta: [
    { name: "sitemap", href: "/sitemap.xml" },
    { name: "attribute", href: "/attribute" },
  ],
};
