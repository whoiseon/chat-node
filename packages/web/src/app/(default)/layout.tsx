export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="w-full h-auto min-h-0">{children}</main>;
}
