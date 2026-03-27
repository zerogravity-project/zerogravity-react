/**
 * [Timezone utility]
 * Read user timezone from cookie for server-side API requests
 * Cookie is set by NextAuthSessionProvider on client mount
 */

import { cookies } from 'next/headers';

/** Default timezone fallback when cookie is not available */
const DEFAULT_TIMEZONE = 'UTC';

/**
 * Get user's timezone from cookie
 * @returns User's IANA timezone string (e.g., 'Asia/Seoul', 'America/New_York')
 */
export async function getTimezone(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('tz')?.value ?? DEFAULT_TIMEZONE;
}

/**
 * Get current Date adjusted to user's timezone
 * @returns Date object with date/time components matching the user's local time
 */
export async function getUserLocalNow(): Promise<Date> {
  const tz = await getTimezone();
  return new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
}
