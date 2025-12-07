import { Button } from "@/labs-registry/components-v1/button";

export default function DemoButton() {
  return (
    <div className="flex items-center gap-5">
      <Button>This is a button</Button>
      <Button variant="link">This is a link</Button>
    </div>
  );
}
