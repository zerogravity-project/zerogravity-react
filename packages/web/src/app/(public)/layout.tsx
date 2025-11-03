import { Navigation } from '@/app/_components/ui/navigation/Navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation className="fixed top-0" />
      {children}
    </>
  );
}
