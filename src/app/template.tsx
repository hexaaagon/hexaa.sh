import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

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
    </>
  );
}
