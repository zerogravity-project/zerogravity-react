// 임시로 빈 미들웨어 (인증 비활성화)
export default function middleware() {
  // 인증 없이 모든 페이지 접근 허용
}

// 원래 인증 미들웨어 (나중에 활성화할 때 주석 해제)
// import { withAuth } from 'next-auth/middleware';

// export default withAuth(
//   function middleware() {
//     // Additional middleware logic can be added here when needed.
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: '/login',
//     },
//   }
// );

// export const config = {
//   matcher: ['/spaceout/:path*', '/record/:path*', '/profile/:path*'],
// };
