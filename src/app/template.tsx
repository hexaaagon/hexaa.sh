import AnimateOnView from "@/components/animation";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnimateOnView className="relative transition-[padding] duration-300">
      <Navbar />
      <div className="pt-[64px] *:min-h-[calc(100dvh-160px)]">{children}</div>
      <span className="-z-40 absolute right-0 bottom-2 left-0 h-6 max-w-dvw bg-[#D9D9D9]/40 blur-[100px]" />
      <Footer />
    </AnimateOnView>
  );
}
