/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { ImageResponseOptions } from "@takumi-rs/image-response";

export interface GenerateProps {
  path: string;
  title: ReactNode;
  description?: ReactNode;
}

const font = readFile(
  "./public/static/fonts/BricolageGrotesque_Regular.ttf",
).then((data) => ({
  name: "Bricolage Grotesque",
  data,
  weight: 400,
}));
const fontBold = readFile(
  "./public/static/fonts/BricolageGrotesque_SemiBold.ttf",
).then((data) => ({
  name: "Bricolage Grotesque",
  data,
  weight: 600,
}));
const fontMono = readFile("./public/static/fonts/GeistMono_Regular.ttf").then(
  (data) => ({
    name: "Geist Mono",
    data,
    weight: 400,
  }),
);

const backgroundImage = readFile(
  "./public/static/images/og/background.png",
).then((data) => `data:image/png;base64,${data.toString("base64")}`);

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    format: "webp",
    fonts: await Promise.all([font, fontBold, fontMono]),
  };
}

export async function generate({ path, title, description }: GenerateProps) {
  const bgImage = await backgroundImage;

  // Calculate text sizing based on length
  const titleText = typeof title === "string" ? title : "";
  const descText = typeof description === "string" ? description : "";

  // Title sizing: scale down for longer titles
  const titleLength = titleText.length;
  let titleSize = "96px"; // text-8xl equivalent

  if (titleLength > 45) titleSize = "60px";
  else if (titleLength > 35) titleSize = "72px";
  else if (titleLength > 25) titleSize = "84px";

  // Description sizing
  const descLength = descText.length;
  let descSize = "24px"; // text-2xl equivalent
  if (descLength > 120) descSize = "18px";
  else if (descLength > 80) descSize = "20px";

  // Truncate text if too long (approximate 2 lines)
  const maxTitleChars = titleLength > 60 ? 80 : titleLength > 40 ? 100 : 120;
  const maxDescChars = 150;

  const truncatedTitle =
    titleText.length > maxTitleChars
      ? `${titleText.slice(0, maxTitleChars)}...`
      : titleText;
  const truncatedDesc =
    descText.length > maxDescChars
      ? `${descText.slice(0, maxDescChars)}...`
      : descText;

  return (
    <div tw="flex flex-col w-full h-full text-white bg-[rgb(10,10,10)] relative font-[Bricolage_Grotesque]">
      <img src={bgImage} tw="absolute top-0 left-0 w-full h-full" alt="" />
      <img
        src={bgImage}
        tw="absolute -bottom-10 -right-30 rotate-180 w-full h-full"
        alt=""
      />
      <header tw="absolute top-0 left-0 w-full flex items-center justify-between px-8 pt-6">
        <section tw="bg-white text-black font-semibold text-[24px] inline-flex items-center px-1 gap-2 -py-6">
          <p tw="tracking-[-0.09em]">hexaa's</p>
          <p tw="tracking-[-0.05em]">blog.</p>
        </section>
        <section tw="text-white font-[Geist_Mono]">
          <p tw="text-[16px] opacity-70">hexaa.sh{path}</p>
        </section>
      </header>

      <main tw="flex flex-col justify-center items-center flex-1 px-32 py-12 w-full z-10 gap-[-5rem] -mt-8">
        <h1
          tw="font-semibold text-center"
          style={{
            fontSize: titleSize,
            lineHeight: 1.1,
            maxHeight: "210px",
            overflow: "hidden",
          }}
        >
          {truncatedTitle || title}
        </h1>
        {description && (
          <p
            tw="text-gray-300 text-center mt-12"
            style={{
              fontSize: descSize,
              lineHeight: 1.3,
              maxHeight: "62px",
              overflow: "hidden",
            }}
          >
            {truncatedDesc || description}
          </p>
        )}
      </main>
    </div>
  );
}
