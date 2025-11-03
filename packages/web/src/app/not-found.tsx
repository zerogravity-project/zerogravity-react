import { redirect } from 'next/navigation';

/**
 * 404 Not Found Page
 * Automatically redirects to home page
 */
export default function NotFound() {
  redirect('/');
}
