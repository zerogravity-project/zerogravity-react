/**
 * [Spaceout Video Layout]
 * Black background for seamless loading/error/video transitions
 */
export default function SpaceoutVideoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-[100dvh] w-[100dvw] bg-black">{children}</div>;
}
