import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <>
      <NavigationAdapter className="fixed top-0" />
      {children}
    </>
  );
}
