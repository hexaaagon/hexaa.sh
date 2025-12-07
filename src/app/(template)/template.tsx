import Footer from "@/components/portfolio/navigation/footer";
import Navbar from "@/components/portfolio/navigation/navbar";
import { SmoothCursor } from "@/labs-registry/components-v1/smooth-cursor";

export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="pt-[64px] *:min-h-[calc(100dvh-115px)]">{children}</div>
      <Footer />
      <SmoothCursor disableRotation />
    </>
  );
}
