'use client';

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-[1919px]:w-[1376px] w-[1728px] mx-auto h-fit">
      {children}
    </div>
  );
}
