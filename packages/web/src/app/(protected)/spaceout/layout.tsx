/**
 * Spaceout layout
 * Wraps the spaceout page and its children
 */
export default function SpaceoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id="main-content" className="contents">
      {children}
    </main>
  );
}
