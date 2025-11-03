import '@zerogravity/shared/styles';
import { IconDescriptor } from 'next/dist/lib/metadata/types/metadata-types';

import type { Metadata } from 'next';

import ClientProviders from './_components/providers/ClientProviders';
import { ModalProvider } from './_components/ui/modal/_contexts/ModalContext';
import { SettingModal } from './_components/ui/modal/SettingModal';

export interface CustomIconDescriptorType extends IconDescriptor {
  precedence?: string;
}

const icon: CustomIconDescriptorType = {
  rel: 'stylesheet',
  url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
  precedence: 'default',
};

export const metadata: Metadata = {
  title: 'ZeroGravity',
  description: '아무것도 하지 않기 위한 시간, 무중력의 세계로',
  icons: {
    other: icon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ClientProviders>
          <ModalProvider>
            {children}
            <SettingModal />
          </ModalProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
