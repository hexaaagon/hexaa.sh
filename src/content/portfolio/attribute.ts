export type Attribute = Array<{
  name: string;
  links: Array<
    | {
        type: "showcase";
        label: string;
        url: string;
        description: string;
      }
    | {
        type: "inspiration";
        label: string;
        url: string;
      }
  >;
}>;

export const attributes: Attribute = [
  {
    name: "Stacks & Technologies",
    links: [
      {
        type: "showcase",
        label: "next.js",
        url: "https://nextjs.org/",
        description:
          "the web-framework i've been using for the past few years, and still going strong. even used it to build this very website!",
      },
      {
        type: "showcase",
        label: "fumadocs",
        url: "https://fumadocs.dev",
        description:
          "my personal blogs site, all done by using Fumadocs. Showcasing my projects, blogs, and technical notes in a clean and organized manner.",
      },
      {
        type: "showcase",
        label: "bun",
        url: "https://bun.sh/",
        description:
          "relatively kinda new for me, but it's been great! easier and faster way to run and develop typescript without using esbuild or tsc.",
      },
    ],
  },
  {
    name: "Design & UI Libraries",
    links: [
      {
        type: "showcase",
        label: "shadcn-ui",
        url: "https://shadcn.com/",
        description:
          "my go-to component library for building beautiful and responsive user interfaces in React applications.",
      },
      {
        type: "showcase",
        label: "paper.design",
        url: "https://paper.design",
        description:
          "a collection of shaders and visual effects that can be easily integrated into web applications to enhance their aesthetics and user experience.",
      },
      {
        type: "showcase",
        label: "21st.dev",
        url: "https://21st.dev/",
        description:
          "the most comprehensive resource for modern web development yet, having headaches trying to find better components and design before, now solved with 21st.dev.",
      },
    ],
  },
  {
    name: "Inspiration & Open Source",
    links: [
      {
        type: "inspiration",
        label: "cnrad.dev",
        url: "https://cnrad.dev/",
      },
      {
        type: "inspiration",
        label: "pow.kim",
        url: "https://pow.kim/",
      },
      {
        type: "inspiration",
        label: "gideon.sh",
        url: "https://gideon.sh/",
      },
      {
        type: "inspiration",
        label: "nevanhidayat.my.id",
        url: "https://nevanhidayat.my.id/",
      },
      {
        type: "inspiration",
        label: "irtideath.vercel.app",
        url: "https://irtideath.vercel.app/",
      },
    ],
  },
];
