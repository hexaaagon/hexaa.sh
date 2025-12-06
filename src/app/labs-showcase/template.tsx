export default function LabsShowcaseTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-primary-foreground/80">{children}</main>
  );
}
