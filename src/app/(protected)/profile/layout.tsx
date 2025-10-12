import { TopNavigation } from '@/app/_components/ui';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNavigation border />
      {children}
    </>
  );
}
