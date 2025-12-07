import Star15 from "@/components/stars/s15";
import { ScrollVelocityRotate } from "@/labs-registry/components-v1/rotate-velocity-scroll";

export default function DemoRotateVelocityScroll() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="inline items-center gap-2 md:inline-flex">
        <ScrollVelocityRotate baseVelocity={30} className="inline-block">
          <Star15 className="inline-block text-yellow-400" size={64} />
        </ScrollVelocityRotate>
        <p className="font-medium text-2xl">ts looks cool</p>
      </span>
      <p className="text-muted-foreground text-sm">
        try scrolling around and see
      </p>
    </div>
  );
}
