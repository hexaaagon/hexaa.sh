import AnimateOnView from "@/components/animation";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnimateOnView
      className="relative transition-[padding] duration-300"
      skipFirstElements={9}
    >
      <Navbar />
      <div className="pt-[64px] *:min-h-[calc(100dvh-115px)]">{children}</div>
      <Footer />
    </AnimateOnView>
  );
}
