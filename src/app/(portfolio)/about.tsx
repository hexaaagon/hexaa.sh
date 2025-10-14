import { PlusSeparator } from "@/components/ui/plus-separator";
import Image from "next/image";

export default function AboutSection() {
  return (
    <footer className="w-full border-separator/10 border-t">
      <div className="inner relative flex flex-col justify-center border-separator/10 border-x px-8 pt-4 pb-24">
        <Image
          src="/static/images/typography/hello.apng"
          alt="hello."
          height={60}
          width={120}
          className="dark:invert"
        />
        <br />
        <p className="w-full lg:w-7/11">
          i'm hexaa, but my real name is bagas. a 15-year-old student and
          developer as a software engineer. i grew up and played around with
          computers since i was a kid, and now i love building things with code.
          i&apos;m passionate about learning new technologies and improving my
          skills.
        </p>
        <br />
        <p className="w-full lg:w-7/11">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
          soluta et sit similique dolore harum. Qui at a labore dicta tempore
          minima est velit ut aliquid, id ea iste natus? Lorem ipsum dolor sit
          amet, consectetur adipisicing elit. Asperiores excepturi accusantium
          porro consequatur dolores autem dolor vitae ducimus quaerat ipsa
          libero vel nulla, quidem reiciendis mollitia quam, architecto
          voluptatibus blanditiis.
        </p>
        <PlusSeparator position={["top-left", "top-right"]} />
      </div>
    </footer>
  );
}
