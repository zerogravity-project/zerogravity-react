/**
 * [Timezone utility tests]
 * Unit tests for server-side timezone functions
 */

import { getTimezone, getUserLocalNow } from '@/lib/timezone';

// Mock next/headers cookies
const mockGet = jest.fn();
jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: mockGet,
  })),
}));

describe('timezone', () => {
  afterEach(() => {
    mockGet.mockReset();
    jest.useRealTimers();
  });

  describe('getTimezone', () => {
    it('returns timezone from tz cookie', async () => {
      mockGet.mockReturnValue({ value: 'Asia/Seoul' });
      const tz = await getTimezone();
      expect(tz).toBe('Asia/Seoul');
      expect(mockGet).toHaveBeenCalledWith('tz');
    });

    it('returns UTC when tz cookie is not set', async () => {
      mockGet.mockReturnValue(undefined);
      const tz = await getTimezone();
      expect(tz).toBe('UTC');
    });
  });

  describe('getUserLocalNow', () => {
    it('returns date in Asia/Seoul timezone (next day across midnight)', async () => {
      mockGet.mockReturnValue({ value: 'Asia/Seoul' });

      // 2024-12-31 20:00:00 UTC = 2025-01-01 05:00:00 KST
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-12-31T20:00:00Z'));

      const now = await getUserLocalNow();
      expect(now.getFullYear()).toBe(2025);
      expect(now.getMonth()).toBe(0); // January
      expect(now.getDate()).toBe(1);
    });

    it('returns date in America/New_York timezone (previous day across midnight)', async () => {
      mockGet.mockReturnValue({ value: 'America/New_York' });

      // 2025-01-01 03:00:00 UTC = 2024-12-31 22:00:00 EST
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T03:00:00Z'));

      const now = await getUserLocalNow();
      expect(now.getFullYear()).toBe(2024);
      expect(now.getMonth()).toBe(11); // December
      expect(now.getDate()).toBe(31);
    });

    it('falls back to UTC when no tz cookie', async () => {
      mockGet.mockReturnValue(undefined);

      // 2025-06-15 10:30:00 UTC
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-06-15T10:30:00Z'));

      const now = await getUserLocalNow();
      expect(now.getFullYear()).toBe(2025);
      expect(now.getMonth()).toBe(5); // June
      expect(now.getDate()).toBe(15);
    });
  });
});
