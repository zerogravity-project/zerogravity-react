/**
 * [ModalContext tests]
 * Unit tests for global modal state management with queue system
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import {
  ModalProvider,
  useModal,
  type AlertModalConfig,
  type ConfirmModalConfig,
  type ComponentModalConfig,
} from '@/app/_components/ui/modal/_contexts/ModalContext';

/*
 * ============================================
 * Mocks
 * ============================================
 */

// Mock Next.js navigation
const mockReplace = jest.fn();
const mockPathname = '/test-page';
const mockSearchParams = new URLSearchParams('');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

// Note: window.location.hash is natively supported in jsdom
// No need to mock - just set directly when needed

/*
 * ============================================
 * Test Utilities
 * ============================================
 */

/** Create wrapper with ModalProvider */
function ModalWrapper({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}
const createWrapper = () => ModalWrapper;

/** Sample alert modal config */
const createAlertConfig = (overrides?: Partial<AlertModalConfig>): AlertModalConfig => ({
  title: 'Alert Title',
  description: 'Alert description',
  ...overrides,
});

/** Sample confirm modal config */
const createConfirmConfig = (overrides?: Partial<ConfirmModalConfig>): ConfirmModalConfig => ({
  title: 'Confirm Title',
  description: 'Confirm description',
  onConfirm: jest.fn(),
  ...overrides,
});

/** Sample component modal config */
const createComponentConfig = (overrides?: Partial<ComponentModalConfig>): ComponentModalConfig => ({
  component: <div>Custom Component</div>,
  ...overrides,
});

/*
 * ============================================
 * Tests
 * ============================================
 */

describe('ModalContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset hash via jsdom's native support
    window.location.hash = '';
  });

  /*
   * --------------------------------------------
   * useModal hook
   * --------------------------------------------
   */
  describe('useModal', () => {
    /** Throws error when used outside provider */
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useModal());
      }).toThrow('useModal must be used within a ModalProvider');

      consoleSpy.mockRestore();
    });

    /** Returns context when used inside provider */
    it('returns context when used inside provider', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.openAlertModal).toBeInstanceOf(Function);
      expect(result.current.openConfirmModal).toBeInstanceOf(Function);
      expect(result.current.openComponentModal).toBeInstanceOf(Function);
    });
  });

  /*
   * --------------------------------------------
   * Initial state
   * --------------------------------------------
   */
  describe('initial state', () => {
    /** Starts with no hash modal open */
    it('starts with no hash modal open', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentHashModal).toBeNull();
    });

    /** Starts with no state modal open */
    it('starts with no state modal open', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentStateModal).toBeNull();
    });
  });

  /*
   * --------------------------------------------
   * Hash-based modals
   * --------------------------------------------
   */
  describe('hash-based modals', () => {
    /** openHashModal calls router.replace with hash URL */
    it('openHashModal calls router.replace with hash URL', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('settings');
      });

      expect(mockReplace).toHaveBeenCalledWith('/test-page#settings', { scroll: false });
    });

    /** openHashModal updates currentHashModal */
    it('openHashModal updates currentHashModal', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('settings');
      });

      expect(result.current.currentHashModal).toBe('settings');
    });

    /** isHashModalOpen returns true for open modal */
    it('isHashModalOpen returns true for open modal', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('settings');
      });

      expect(result.current.isHashModalOpen('settings')).toBe(true);
      expect(result.current.isHashModalOpen('other')).toBe(false);
    });

    /** closeModal closes hash modal and clears URL hash */
    it('closeModal closes hash modal and clears URL hash', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('settings');
      });

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.currentHashModal).toBeNull();
      expect(mockReplace).toHaveBeenLastCalledWith('/test-page', { scroll: false });
    });
  });

  /*
   * --------------------------------------------
   * Alert modals
   * --------------------------------------------
   */
  describe('alert modals', () => {
    /** openAlertModal adds modal to queue and displays it */
    it('openAlertModal adds modal to queue and displays it', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createAlertConfig();

      act(() => {
        result.current.openAlertModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      expect(result.current.currentStateModal?.type).toBe('alert');
      expect(result.current.currentStateModal?.config).toEqual(config);
    });

    /** Alert modal config has correct properties */
    it('alert modal config has correct properties', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createAlertConfig({
        id: 'alert-1',
        title: 'Custom Title',
        description: 'Custom Description',
        confirmText: 'OK',
        onConfirm: jest.fn(),
      });

      act(() => {
        result.current.openAlertModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      const modalConfig = result.current.currentStateModal?.config as AlertModalConfig;
      expect(modalConfig.id).toBe('alert-1');
      expect(modalConfig.title).toBe('Custom Title');
      expect(modalConfig.description).toBe('Custom Description');
      expect(modalConfig.confirmText).toBe('OK');
    });
  });

  /*
   * --------------------------------------------
   * Confirm modals
   * --------------------------------------------
   */
  describe('confirm modals', () => {
    /** openConfirmModal adds modal to queue and displays it */
    it('openConfirmModal adds modal to queue and displays it', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createConfirmConfig();

      act(() => {
        result.current.openConfirmModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      expect(result.current.currentStateModal?.type).toBe('confirm');
    });

    /** Confirm modal config has required onConfirm callback */
    it('confirm modal config has required onConfirm callback', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const onConfirm = jest.fn();
      const config = createConfirmConfig({ onConfirm });

      act(() => {
        result.current.openConfirmModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      const modalConfig = result.current.currentStateModal?.config as ConfirmModalConfig;
      expect(modalConfig.onConfirm).toBe(onConfirm);
    });

    /** Confirm modal config supports optional onCancel */
    it('confirm modal config supports optional onCancel', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const onCancel = jest.fn();
      const config = createConfirmConfig({ onCancel });

      act(() => {
        result.current.openConfirmModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      const modalConfig = result.current.currentStateModal?.config as ConfirmModalConfig;
      expect(modalConfig.onCancel).toBe(onCancel);
    });
  });

  /*
   * --------------------------------------------
   * Component modals
   * --------------------------------------------
   */
  describe('component modals', () => {
    /** openComponentModal adds modal to queue and displays it */
    it('openComponentModal adds modal to queue and displays it', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createComponentConfig();

      act(() => {
        result.current.openComponentModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      expect(result.current.currentStateModal?.type).toBe('component');
    });

    /** Component modal config supports size option */
    it('component modal config supports size option', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createComponentConfig({ size: 'lg' });

      act(() => {
        result.current.openComponentModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      const modalConfig = result.current.currentStateModal?.config as ComponentModalConfig;
      expect(modalConfig.size).toBe('lg');
    });

    /** Component modal config supports closeOnOutsideClick */
    it('component modal config supports closeOnOutsideClick', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createComponentConfig({ closeOnOutsideClick: false });

      act(() => {
        result.current.openComponentModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      const modalConfig = result.current.currentStateModal?.config as ComponentModalConfig;
      expect(modalConfig.closeOnOutsideClick).toBe(false);
    });
  });

  /*
   * --------------------------------------------
   * Modal queue
   * --------------------------------------------
   */
  describe('modal queue', () => {
    /** Processes modals in FIFO order */
    it('processes modals in FIFO order', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const alert1 = createAlertConfig({ id: 'alert-1', title: 'First' });
      const alert2 = createAlertConfig({ id: 'alert-2', title: 'Second' });

      act(() => {
        result.current.openAlertModal(alert1);
        result.current.openAlertModal(alert2);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      // First modal should be displayed first
      expect((result.current.currentStateModal?.config as AlertModalConfig).title).toBe('First');

      // Close first modal
      act(() => {
        result.current.closeModal();
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
        expect((result.current.currentStateModal?.config as AlertModalConfig).title).toBe('Second');
      });
    });

    /** Prevents duplicate modals with same ID */
    it('prevents duplicate modals with same ID', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createAlertConfig({ id: 'duplicate-id' });

      act(() => {
        result.current.openAlertModal(config);
        result.current.openAlertModal(config); // Duplicate
        result.current.openAlertModal(config); // Duplicate
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      // Close first modal
      act(() => {
        result.current.closeModal();
      });

      // No more modals should be in queue
      await waitFor(() => {
        expect(result.current.currentStateModal).toBeNull();
      });
    });

    /** Allows modals without ID to be duplicated */
    it('allows modals without ID to be duplicated', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      const config = createAlertConfig({ title: 'No ID Modal' });

      act(() => {
        result.current.openAlertModal(config);
        result.current.openAlertModal(config);
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      // Close first modal
      act(() => {
        result.current.closeModal();
      });

      // Second modal should appear (no ID means no deduplication)
      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });
    });
  });

  /*
   * --------------------------------------------
   * closeModal
   * --------------------------------------------
   */
  describe('closeModal', () => {
    /** Closes state-based modal */
    it('closes state-based modal', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openAlertModal(createAlertConfig());
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      act(() => {
        result.current.closeModal();
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).toBeNull();
      });
    });

    /** Prioritizes closing hash modal over state modal */
    it('prioritizes closing hash modal over state modal', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      // Open both hash and state modal
      act(() => {
        result.current.openHashModal('settings');
        result.current.openAlertModal(createAlertConfig());
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      expect(result.current.currentHashModal).toBe('settings');

      // Close should close hash modal first
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.currentHashModal).toBeNull();
      // State modal should still be open
      expect(result.current.currentStateModal).not.toBeNull();
    });
  });

  /*
   * --------------------------------------------
   * closeAllModals
   * --------------------------------------------
   */
  describe('closeAllModals', () => {
    /** Closes hash modal */
    it('closes hash modal', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('settings');
      });

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.currentHashModal).toBeNull();
    });

    /** Closes state modal and clears queue */
    it('closes state modal and clears queue', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openAlertModal(createAlertConfig({ id: 'alert-1' }));
        result.current.openAlertModal(createAlertConfig({ id: 'alert-2' }));
        result.current.openAlertModal(createAlertConfig({ id: 'alert-3' }));
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.currentStateModal).toBeNull();

      // Wait a bit to ensure no modal from queue appears
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.currentStateModal).toBeNull();
    });

    /** Closes both hash and state modals */
    it('closes both hash and state modals', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('settings');
        result.current.openAlertModal(createAlertConfig());
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.currentHashModal).toBeNull();
      expect(result.current.currentStateModal).toBeNull();
    });
  });

  /*
   * --------------------------------------------
   * Mixed modal types
   * --------------------------------------------
   */
  describe('mixed modal types', () => {
    /** Queues different modal types */
    it('queues different modal types', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openAlertModal(createAlertConfig({ id: 'alert-1' }));
        result.current.openConfirmModal(createConfirmConfig({ id: 'confirm-1' }));
        result.current.openComponentModal(createComponentConfig({ id: 'component-1' }));
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      // First should be alert
      expect(result.current.currentStateModal?.type).toBe('alert');

      // Close and check second
      act(() => {
        result.current.closeModal();
      });

      await waitFor(() => {
        expect(result.current.currentStateModal?.type).toBe('confirm');
      });

      // Close and check third
      act(() => {
        result.current.closeModal();
      });

      await waitFor(() => {
        expect(result.current.currentStateModal?.type).toBe('component');
      });
    });
  });

  /*
   * --------------------------------------------
   * Edge cases
   * --------------------------------------------
   */
  describe('edge cases', () => {
    /** closeModal does nothing when no modal is open */
    it('closeModal does nothing when no modal is open', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      // Should not throw
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.currentHashModal).toBeNull();
      expect(result.current.currentStateModal).toBeNull();
    });

    /** closeAllModals does nothing when no modal is open */
    it('closeAllModals does nothing when no modal is open', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      // Should not throw
      act(() => {
        result.current.closeAllModals();
      });

      expect(result.current.currentHashModal).toBeNull();
      expect(result.current.currentStateModal).toBeNull();
    });

    /** Handles rapid open/close operations */
    it('handles rapid open/close operations', async () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      // Queue two modals rapidly
      act(() => {
        result.current.openAlertModal(createAlertConfig({ id: 'rapid-1' }));
        result.current.openAlertModal(createAlertConfig({ id: 'rapid-2' }));
      });

      await waitFor(() => {
        expect(result.current.currentStateModal).not.toBeNull();
      });

      // First modal should be displayed (FIFO)
      expect((result.current.currentStateModal?.config as AlertModalConfig).id).toBe('rapid-1');

      // Close first modal
      act(() => {
        result.current.closeModal();
      });

      // Second modal should now appear
      await waitFor(() => {
        expect((result.current.currentStateModal?.config as AlertModalConfig).id).toBe('rapid-2');
      });
    });

    /** openHashModal with different IDs updates correctly */
    it('openHashModal with different IDs updates correctly', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.openHashModal('first');
      });

      expect(result.current.currentHashModal).toBe('first');

      act(() => {
        result.current.openHashModal('second');
      });

      expect(result.current.currentHashModal).toBe('second');
      expect(result.current.isHashModalOpen('first')).toBe(false);
      expect(result.current.isHashModalOpen('second')).toBe(true);
    });
  });
});
