import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationAdapter className="fixed top-0" />
      {children}
    </>
  );
}
