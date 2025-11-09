import { useEffect, useState } from 'react';

import { getUserInfo, type SessionData, type User } from '../lib/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  sessionData: SessionData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React hook for managing authentication state in Chrome Extension
 * Checks session only on mount (new tab open) as per user requirement
 */
export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const authInfo = await getUserInfo();

      setIsAuthenticated(authInfo.isAuthenticated);
      setUser(authInfo.user);
      setSessionData(authInfo.sessionData);
    } catch (err) {
      console.error('[useAuth] Error fetching auth status:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsAuthenticated(false);
      setUser(null);
      setSessionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount only (when new tab is opened)
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return {
    isAuthenticated,
    user,
    sessionData,
    isLoading,
    error,
    refetch: fetchAuthStatus,
  };
}
