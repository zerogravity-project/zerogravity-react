/**
 * [ModalContext]
 * Global modal state management with queue system
 */

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

/** Alert modal configuration (single confirm button) */
interface AlertModalConfig {
  id?: string;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm?: () => void;
}

/** Confirm modal configuration (confirm + cancel buttons) */
interface ConfirmModalConfig {
  id?: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

/** Component modal configuration (custom component) */
interface ComponentModalConfig {
  id?: string;
  component: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOutsideClick?: boolean;
}

/** Modal types for queue management */
type ModalType = 'alert' | 'confirm' | 'component';

/** Queue item containing modal config and type */
interface ModalQueueItem {
  type: ModalType;
  config: AlertModalConfig | ConfirmModalConfig | ComponentModalConfig;
}

interface ModalContextType {
  /** Open a hash-based modal by setting URL hash */
  openHashModal: (modalId: string) => void;
  /** Open an alert modal (single button) */
  openAlertModal: (config: AlertModalConfig) => void;
  /** Open a confirm modal (two buttons) */
  openConfirmModal: (config: ConfirmModalConfig) => void;
  /** Open a component modal (custom content) */
  openComponentModal: (config: ComponentModalConfig) => void;
  /** Close the currently displayed modal */
  closeModal: () => void;
  /** Close all modals and clear queue */
  closeAllModals: () => void;
  /** Check if a specific hash modal is currently open */
  isHashModalOpen: (modalId: string) => boolean;
  /** ID of the currently open hash modal, or null if none */
  currentHashModal: string | null;
  /** Currently displayed state-based modal */
  currentStateModal: ModalQueueItem | null;
}

/*
 * ============================================
 * Context
 * ============================================
 *
 * Global modal state management
 * Supports alert, confirm, component modals and hash-based modals
 * Manages modal queue for sequential display
 */

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/*
 * ============================================
 * Provider
 * ============================================
 *
 * Provides modal operations to child components
 * Handles URL hash sync for hash-based modals
 * Processes modal queue with FIFO order
 */

export function ModalProvider({ children }: { children: React.ReactNode }) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [currentHashModal, setCurrentHashModal] = useState<string | null>(null);
  const [currentStateModal, setCurrentStateModal] = useState<ModalQueueItem | null>(null);
  const [modalQueue, setModalQueue] = useState<ModalQueueItem[]>([]);

  /*
   * --------------------------------------------
   * 3. Callbacks
   * --------------------------------------------
   */
  /** Build URL with hash while preserving path and query params */
  const buildUrl = useCallback(
    (hash?: string) => {
      const base = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      return hash ? `${base}#${hash}` : base;
    },
    [pathname, searchParams]
  );

  /** Open a hash-based modal by ID, updating URL hash without scroll */
  const openHashModal = useCallback(
    (modalId: string) => {
      // Use replace to prevent scroll jump even when reopening same hash
      router.replace(buildUrl(modalId), { scroll: false });
      setCurrentHashModal(modalId);
    },
    [router, buildUrl]
  );

  /** Add a modal to the queue with ID-based deduplication */
  const enqueueModal = useCallback(
    (type: ModalType, config: AlertModalConfig | ConfirmModalConfig | ComponentModalConfig) => {
      setModalQueue(prevQueue => {
        // If ID is provided, check for duplicates
        if (config.id) {
          const isDuplicate = prevQueue.some(item => item.config.id === config.id);
          if (isDuplicate) {
            return prevQueue;
          }
        }

        // Add to queue
        return [...prevQueue, { type, config }];
      });
    },
    []
  );

  /** Open an alert modal */
  const openAlertModal = useCallback(
    (config: AlertModalConfig) => {
      enqueueModal('alert', config);
    },
    [enqueueModal]
  );

  /** Open a confirm modal */
  const openConfirmModal = useCallback(
    (config: ConfirmModalConfig) => {
      enqueueModal('confirm', config);
    },
    [enqueueModal]
  );

  /** Open a component modal */
  const openComponentModal = useCallback(
    (config: ComponentModalConfig) => {
      enqueueModal('component', config);
    },
    [enqueueModal]
  );

  /** Close the currently displayed modal */
  const closeModal = useCallback(() => {
    // Close hash-based modal if open
    if (currentHashModal) {
      router.replace(buildUrl(undefined), { scroll: false });
      setCurrentHashModal(null);
      return;
    }

    // Close state-based modal if open
    if (currentStateModal) {
      setCurrentStateModal(null);
    }
  }, [currentHashModal, currentStateModal, router, buildUrl]);

  /** Close all modals and clear the queue */
  const closeAllModals = useCallback(() => {
    // Close hash-based modal
    if (currentHashModal) {
      router.replace(buildUrl(undefined), { scroll: false });
      setCurrentHashModal(null);
    }

    // Close state-based modal and clear queue
    setCurrentStateModal(null);
    setModalQueue([]);
  }, [currentHashModal, router, buildUrl]);

  /*
   * --------------------------------------------
   * 4. Helper Functions
   * --------------------------------------------
   */
  /** Safely read hash from current URL (SSR-safe) */
  const getHash = () => (typeof window !== 'undefined' ? window.location.hash : '');

  /*
   * --------------------------------------------
   * 5. Effects
   * --------------------------------------------
   */
  /** Sync hash modal state from URL hash on mount and hash changes */
  useEffect(() => {
    const syncFromHash = () => {
      const raw = getHash();
      // Remove leading '#' if present
      const next = raw.startsWith('#') ? raw.slice(1) : '';
      setCurrentHashModal(next || null);
    };

    // Initial sync on mount
    syncFromHash();

    // Listen for hash changes (browser back/forward, manual hash changes)
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  /** Reflect current hash on route/query param changes (Next.js router navigation) */
  useEffect(() => {
    const raw = getHash();
    // Remove leading '#' if present
    const next = raw.startsWith('#') ? raw.slice(1) : '';
    setCurrentHashModal(next || null);
  }, [pathname, searchParams]);

  /** Process modal queue - display next modal when current is closed */
  useEffect(() => {
    // Only process queue if no state-based modal is currently displayed
    if (!currentStateModal && modalQueue.length > 0) {
      // Get the first modal from queue
      const [nextModal, ...remainingQueue] = modalQueue;
      setCurrentStateModal(nextModal);
      setModalQueue(remainingQueue);
    }
  }, [currentStateModal, modalQueue]);

  /*
   * --------------------------------------------
   * 6. Context Values
   * --------------------------------------------
   */
  /** Memoized context value with all modal operations */
  const value = useMemo<ModalContextType>(
    () => ({
      openHashModal,
      openAlertModal,
      openConfirmModal,
      openComponentModal,
      closeModal,
      closeAllModals,
      isHashModalOpen: id => currentHashModal === id,
      currentHashModal,
      currentStateModal,
    }),
    [
      openHashModal,
      openAlertModal,
      openConfirmModal,
      openComponentModal,
      closeModal,
      closeAllModals,
      currentHashModal,
      currentStateModal,
    ]
  );

  /*
   * --------------------------------------------
   * 7. Return
   * --------------------------------------------
   */
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/*
 * ============================================
 * Custom Hooks
 * ============================================
 */

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
}

/*
 * ============================================
 * Type Exports
 * ============================================
 */

export type { AlertModalConfig, ComponentModalConfig, ConfirmModalConfig, ModalQueueItem };
