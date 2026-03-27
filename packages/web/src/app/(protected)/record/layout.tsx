/**
 * Record layout
 * Wraps the record page and its children
 */
export default function RecordLayout({
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
