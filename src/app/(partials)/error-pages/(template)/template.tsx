import RootTemplate from "@/app/(template)/template";

export default function Template({ children }: { children: React.ReactNode }) {
  return <RootTemplate>{children}</RootTemplate>;
}
