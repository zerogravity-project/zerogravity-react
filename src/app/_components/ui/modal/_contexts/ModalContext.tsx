'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ModalContextType {
  openModal: (modalId: string) => void;
  closeModal: () => void;
  isModalOpen: (modalId: string) => boolean;
  currentModal: string | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Keep query params

  const [currentModal, setCurrentModal] = useState<string | null>(null);

  // Safely read hash from current URL
  const getHash = () => (typeof window !== 'undefined' ? window.location.hash : '');

  // Only manipulate hash (preserve path/query)
  const buildUrl = useCallback(
    (hash?: string) => {
      const base = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      return hash ? `${base}#${hash}` : base;
    },
    [pathname, searchParams]
  );

  const openModal = useCallback(
    (modalId: string) => {
      // Use replace to prevent scroll jump even when reopening same hash
      router.replace(buildUrl(modalId), { scroll: false });
      setCurrentModal(modalId);
    },
    [router, buildUrl]
  );

  const closeModal = useCallback(() => {
    router.replace(buildUrl(undefined), { scroll: false }); // Remove hash
    setCurrentModal(null);
  }, [router, buildUrl]);

  // 1) Initial mount & 2) Hash change sync
  useEffect(() => {
    const syncFromHash = () => {
      const raw = getHash();
      const next = raw.startsWith('#') ? raw.slice(1) : '';
      setCurrentModal(next || null);
    };
    // Initial sync
    syncFromHash();
    // Hash change event
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Reflect current hash on route/query changes (Next router navigation case)
  useEffect(() => {
    const raw = getHash();
    const next = raw.startsWith('#') ? raw.slice(1) : '';
    setCurrentModal(next || null);
  }, [pathname, searchParams]);

  const value = useMemo<ModalContextType>(
    () => ({
      openModal,
      closeModal,
      isModalOpen: id => currentModal === id,
      currentModal,
    }),
    [currentModal, openModal, closeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
}
