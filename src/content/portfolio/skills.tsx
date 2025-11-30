import { LanguagesTools } from "@/components/languages-tools";
import * as icon from "@icons-pack/react-simple-icons";
import { CustomIcons } from "@/components/icons";
import { FileVideoCamera } from "lucide-react";

export interface ToolItem {
  name: string;
  Icon: React.ComponentType<{ className?: string; size?: number | string }>;
  hex: string;
  classNames?: {
    icon?: string;
    container?: string;
  };
}

export const frontendTools: ToolItem[] = [
  { name: "TypeScript", Icon: icon.SiTypescript, hex: icon.SiTypescriptHex },
  { name: "React", Icon: icon.SiReact, hex: icon.SiReactHex },
  {
    name: "Next.js",
    Icon: icon.SiNextdotjs,
    hex: icon.SiNextdotjsHex,
    classNames: {
      icon: "group-hover:invert dark:group-hover:invert-0",
    },
  },
  { name: "Svelte", Icon: icon.SiSvelte, hex: icon.SiSvelteHex },
  {
    name: "Tailwind CSS",
    Icon: icon.SiTailwindcss,
    hex: icon.SiTailwindcssHex,
  },
];

export const backendTools: ToolItem[] = [
  {
    name: "Bun",
    Icon: icon.SiBun,
    hex: icon.SiBunHex,
    classNames: {
      icon: "group-hover:invert dark:group-hover:invert-0",
    },
  },
  { name: "Node.js", Icon: icon.SiNodedotjs, hex: icon.SiNodedotjsHex },
  { name: "TypeScript", Icon: icon.SiTypescript, hex: icon.SiTypescriptHex },
  { name: "PostgreSQL", Icon: icon.SiPostgresql, hex: icon.SiPostgresqlHex },
  {
    name: "Drizzle ORM",
    Icon: icon.SiDrizzle,
    hex: icon.SiDrizzleHex,
    classNames: {
      icon: "dark:group-hover:invert",
    },
  },
  { name: "Docker", Icon: icon.SiDocker, hex: icon.SiDockerHex },
];

export const graphicTools: ToolItem[] = [
  { name: "Figma", Icon: icon.SiFigma, hex: icon.SiFigmaHex },
  { name: "Canva", Icon: icon.SiCanva, hex: icon.SiCanvaHex },
  {
    name: "Alight Motion",
    Icon: FileVideoCamera,
    hex: "#000020",
    classNames: {
      icon: "group-hover:invert dark:group-hover:invert-0",
    },
  },
];

export const uiuxTools: ToolItem[] = [
  { name: "Figma", Icon: icon.SiFigma, hex: icon.SiFigmaHex },
  { name: "Framer", Icon: icon.SiFramer, hex: icon.SiFramerHex },
  { name: "LottieFiles", Icon: icon.SiLottiefiles, hex: icon.SiLottiefilesHex },
];

export const mobileTools: ToolItem[] = [
  { name: "React Native", Icon: icon.SiReact, hex: icon.SiReactHex },
  {
    name: "Expo",
    Icon: CustomIcons.expo,
    hex: "#000020",
    classNames: {
      icon: "group-hover:invert dark:group-hover:invert-0",
    },
  },
  {
    name: "Lynx",
    Icon: CustomIcons.lynx,
    hex: "#000020",
    classNames: {
      icon: "group-hover:invert dark:group-hover:invert-0",
    },
  },
];

export const skillsContent: Record<
  string,
  {
    title: string;
    element: React.ReactNode;
  }
> = {
  frontend: {
    title: "Frontend Development",
    element: (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          Crafting responsive and interactive user interfaces with modern web
          technologies. Specializing in React ecosystem and component-driven
          architecture.
        </p>
        <LanguagesTools
          items={frontendTools}
          variant="default"
          className="justify-center"
        />
      </div>
    ),
  },
  backend: {
    title: "Backend Development",
    element: (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          Building scalable server-side applications and APIs with Node.js.
          Experience with both SQL and NoSQL databases, focusing on performance
          and security.
        </p>
        <LanguagesTools items={backendTools} className="justify-center" />
      </div>
    ),
  },
  graphic: {
    title: "Graphic Designer",
    element: (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          Creating visual identities, illustrations, and digital art. Bringing
          creative visions to life.
        </p>
        <LanguagesTools
          items={graphicTools}
          variant="default"
          className="justify-center"
        />
      </div>
    ),
  },
  uiux: {
    title: "UI/UX Designer",
    element: (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          Designing intuitive user experiences and beautiful interfaces. Focused
          on user-centered design principles and modern design systems.
        </p>
        <LanguagesTools
          items={uiuxTools}
          variant="default"
          className="justify-center"
        />
      </div>
    ),
  },
  mobile: {
    title: "Mobile Development",
    element: (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground">
          Developing cross-platform mobile applications. Experience with modern
          frameworks for iOS and Android development.
        </p>
        <LanguagesTools
          items={mobileTools}
          variant="default"
          className="justify-center"
        />
      </div>
    ),
  },
};
