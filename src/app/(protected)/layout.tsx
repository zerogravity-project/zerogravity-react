// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';
// import { authOptions } from '@/lib/auth';

// 임시: 인증 우회 (개발용)
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   redirect('/login');
  // }

  return <>{children}</>;
}
