/**
 * [EmotionRecordContext tests]
 * Unit tests for emotion recording flow context
 */

import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import {
  EmotionRecordProvider,
  FINAL_STEP,
  MAIN_SEQUENCE,
  MAIN_STEP_ORDER,
  useEmotionRecordContext,
} from '@/app/(protected)/record/_contexts/EmotionRecordContext';

// Mock Next.js navigation
const mockReplace = jest.fn();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

/*
 * ============================================
 * Test Utilities
 * ============================================
 */

interface WrapperProps {
  children: ReactNode;
  emotionRecordType?: 'daily' | 'moment';
  date?: string | null;
  initialStep?: string;
}

/** Create wrapper with EmotionRecordProvider */
const createWrapper = ({
  emotionRecordType = 'daily',
  date = '2024-01-15',
  initialStep = 'emotion',
}: Omit<WrapperProps, 'children'> = {}) => {
  // Set up URL param mock
  mockGet.mockImplementation((key: string) => {
    if (key === 'step') return initialStep;
    if (key === 'date') return date;
    return null;
  });

  function EmotionRecordWrapper({ children }: { children: ReactNode }) {
    return (
      <EmotionRecordProvider emotionRecordType={emotionRecordType} date={date}>
        {children}
      </EmotionRecordProvider>
    );
  }
  return EmotionRecordWrapper;
};

/*
 * ============================================
 * Tests
 * ============================================
 */

describe('EmotionRecordContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  /*
   * --------------------------------------------
   * Constants
   * --------------------------------------------
   */
  describe('constants', () => {
    /** Has correct MAIN_STEP_ORDER */
    it('has correct MAIN_STEP_ORDER', () => {
      expect(MAIN_STEP_ORDER).toEqual({
        emotion: 0,
        reason: 1,
        diary: 2,
      });
    });

    /** Has correct MAIN_SEQUENCE */
    it('has correct MAIN_SEQUENCE', () => {
      expect(MAIN_SEQUENCE).toEqual(['emotion', 'reason', 'diary']);
    });

    /** Has correct FINAL_STEP for each record type */
    it('has correct FINAL_STEP for each record type', () => {
      expect(FINAL_STEP).toEqual({
        moment: 'reason',
        daily: 'diary',
      });
    });
  });

  /*
   * --------------------------------------------
   * useEmotionRecordContext hook
   * --------------------------------------------
   */
  describe('useEmotionRecordContext', () => {
    /** Throws error when used outside provider */
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useEmotionRecordContext());
      }).toThrow('useEmotionRecordContext must be used within an EmotionRecordProvider');

      consoleSpy.mockRestore();
    });

    /** Returns context when used inside provider */
    it('returns context when used inside provider', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.emotionId).toBeDefined();
      expect(result.current.currentStep).toBeDefined();
    });
  });

  /*
   * --------------------------------------------
   * Initial state
   * --------------------------------------------
   */
  describe('initial state', () => {
    /** Sets default emotionId to 3 (neutral) */
    it('sets default emotionId to 3 (neutral)', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.emotionId).toBe(3);
    });

    /** Sets default emotionReasons to empty array */
    it('sets default emotionReasons to empty array', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.emotionReasons).toEqual([]);
    });

    /** Sets default diaryEntry to empty string */
    it('sets default diaryEntry to empty string', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.diaryEntry).toBe('');
    });

    /** Starts at emotion step by default */
    it('starts at emotion step by default', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentStep).toBe('emotion');
    });

    /** Uses emotionRecordType from props */
    it('uses emotionRecordType from props', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ emotionRecordType: 'moment' }),
      });

      expect(result.current.emotionRecordType).toBe('moment');
    });

    /** Uses date from props */
    it('uses date from props', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ date: '2024-06-15' }),
      });

      expect(result.current.date).toBe('2024-06-15');
    });
  });

  /*
   * --------------------------------------------
   * Setters
   * --------------------------------------------
   */
  describe('setters', () => {
    /** setEmotionId updates emotionId */
    it('setEmotionId updates emotionId', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setEmotionId(5);
      });

      expect(result.current.emotionId).toBe(5);
    });

    /** setEmotionReasons updates emotionReasons */
    it('setEmotionReasons updates emotionReasons', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setEmotionReasons(['Work', 'Health']);
      });

      expect(result.current.emotionReasons).toEqual(['Work', 'Health']);
    });

    /** setDiaryEntry updates diaryEntry */
    it('setDiaryEntry updates diaryEntry', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setDiaryEntry('Today was good');
      });

      expect(result.current.diaryEntry).toBe('Today was good');
    });

    /** setAiAnalysisId updates aiAnalysisId */
    it('setAiAnalysisId updates aiAnalysisId', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setAiAnalysisId('analysis-123');
      });

      expect(result.current.aiAnalysisId).toBe('analysis-123');
    });
  });

  /*
   * --------------------------------------------
   * canGoNext validation
   * --------------------------------------------
   */
  describe('canGoNext', () => {
    /** Returns true at emotion step */
    it('returns true at emotion step (emotionId is always valid)', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canGoNext).toBe(true);
    });

    /** Returns false at reason step when no reasons selected */
    it('returns false at reason step when no reasons selected', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ initialStep: 'reason' }),
      });

      // Need to set up the state properly - reasons empty by default
      expect(result.current.canGoNext).toBe(false);
    });

    /** Returns true at reason step when reasons selected */
    it('returns true at reason step when reasons selected', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ initialStep: 'reason' }),
      });

      act(() => {
        result.current.setEmotionReasons(['Work']);
      });

      expect(result.current.canGoNext).toBe(true);
    });

    /** Returns true at diary step when entry is <= 300 chars */
    it('returns true at diary step when entry is <= 300 chars', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ initialStep: 'diary' }),
      });

      act(() => {
        result.current.setDiaryEntry('Short entry');
      });

      expect(result.current.canGoNext).toBe(true);
    });
  });

  /*
   * --------------------------------------------
   * canGoToStep validation
   * --------------------------------------------
   */
  describe('canGoToStep', () => {
    /** Can always go to emotion step */
    it('can always go to emotion step', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canGoToStep('emotion')).toBe(true);
    });

    /** Can go to reason step when emotion is valid */
    it('can go to reason step when emotion is valid', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      // emotionId defaults to 3, which is valid
      expect(result.current.canGoToStep('reason')).toBe(true);
    });

    /** Cannot go to diary step when reason is not valid */
    it('cannot go to diary step when reason is not valid', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      // No reasons selected
      expect(result.current.canGoToStep('diary')).toBe(false);
    });

    /** Can go to diary step when all previous steps are valid */
    it('can go to diary step when all previous steps are valid', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setEmotionReasons(['Work']);
      });

      expect(result.current.canGoToStep('diary')).toBe(true);
    });

    /** Can always go to ai-prediction (optional step) */
    it('can always go to ai-prediction (optional step)', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canGoToStep('ai-prediction')).toBe(true);
    });
  });

  /*
   * --------------------------------------------
   * isFinalStep
   * --------------------------------------------
   */
  describe('isFinalStep', () => {
    /** Returns true at diary step for daily record */
    it('returns true at diary step for daily record', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ emotionRecordType: 'daily' }),
      });

      // Set up valid state to navigate to diary
      act(() => {
        result.current.setEmotionReasons(['Work']);
      });

      act(() => {
        result.current.goToStep('diary');
      });

      expect(result.current.currentStep).toBe('diary');
      expect(result.current.isFinalStep).toBe(true);
    });

    /** Returns false at reason step for daily record */
    it('returns false at reason step for daily record', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ emotionRecordType: 'daily', initialStep: 'reason' }),
      });

      expect(result.current.isFinalStep).toBe(false);
    });

    /** Returns true at reason step for moment record */
    it('returns true at reason step for moment record', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ emotionRecordType: 'moment', initialStep: 'reason' }),
      });

      expect(result.current.isFinalStep).toBe(true);
    });

    /** Returns false at emotion step for moment record */
    it('returns false at emotion step for moment record', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ emotionRecordType: 'moment', initialStep: 'emotion' }),
      });

      expect(result.current.isFinalStep).toBe(false);
    });
  });

  /*
   * --------------------------------------------
   * Step navigation
   * --------------------------------------------
   */
  describe('step navigation', () => {
    describe('goToStep', () => {
      /** Updates currentStep when navigation is valid */
      it('updates currentStep when navigation is valid', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.goToStep('reason');
        });

        expect(result.current.currentStep).toBe('reason');
      });

      /** Calls router.replace with correct URL */
      it('calls router.replace with correct URL', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper({ date: '2024-01-15' }),
        });

        act(() => {
          result.current.goToStep('reason');
        });

        expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('step=reason'), expect.any(Object));
      });

      /** Does not navigate when canGoToStep returns false */
      it('does not navigate when canGoToStep returns false', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper(),
        });

        // Try to go to diary without selecting reasons
        act(() => {
          result.current.goToStep('diary');
        });

        // Should stay at emotion step
        expect(result.current.currentStep).toBe('emotion');
        consoleSpy.mockRestore();
      });
    });

    describe('nextStep', () => {
      /** Advances to next step when canGoNext is true */
      it('advances to next step when canGoNext is true', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.nextStep();
        });

        expect(result.current.currentStep).toBe('reason');
      });

      /** Does not advance when canGoNext is false */
      it('does not advance when canGoNext is false', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper({ initialStep: 'reason' }),
        });

        // canGoNext is false (no reasons selected)
        act(() => {
          result.current.nextStep();
        });

        // Should stay at reason
        expect(result.current.currentStep).toBe('reason');
        consoleSpy.mockRestore();
      });

      /** Does not advance past final step for moment record */
      it('does not advance past final step for moment record', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper({ emotionRecordType: 'moment', initialStep: 'reason' }),
        });

        // Set up valid state
        act(() => {
          result.current.setEmotionReasons(['Work']);
        });

        act(() => {
          result.current.nextStep();
        });

        // Should stay at reason (final step for moment)
        expect(result.current.currentStep).toBe('reason');
      });
    });

    describe('prevStep', () => {
      /** Goes back to previous step */
      it('goes back to previous step', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper({ initialStep: 'reason' }),
        });

        act(() => {
          result.current.prevStep();
        });

        expect(result.current.currentStep).toBe('emotion');
      });

      /** Does not go back from first step */
      it('does not go back from first step', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper({ initialStep: 'emotion' }),
        });

        act(() => {
          result.current.prevStep();
        });

        // Should stay at emotion
        expect(result.current.currentStep).toBe('emotion');
      });

      /** Goes from diary to reason */
      it('goes from diary to reason', () => {
        const { result } = renderHook(() => useEmotionRecordContext(), {
          wrapper: createWrapper(),
        });

        // Navigate to diary properly (need valid reasons first)
        act(() => {
          result.current.setEmotionReasons(['Work']);
        });

        act(() => {
          result.current.goToStep('diary');
        });

        expect(result.current.currentStep).toBe('diary');

        act(() => {
          result.current.prevStep();
        });

        expect(result.current.currentStep).toBe('reason');
      });
    });
  });

  /*
   * --------------------------------------------
   * Emotion slider sync
   * --------------------------------------------
   */
  describe('emotion slider sync', () => {
    /** Updates emotionSliderValue when emotionId changes */
    it('updates emotionSliderValue when emotionId changes', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      const initialSliderValue = result.current.emotionSliderValue[0];

      act(() => {
        result.current.setEmotionId(6);
      });

      // Slider value should change
      expect(result.current.emotionSliderValue[0]).not.toBe(initialSliderValue);
    });

    /** emotionValueToStepIndex reflects current slider value */
    it('emotionValueToStepIndex reflects current slider value', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      // Default emotionId is 3
      expect(result.current.emotionValueToStepIndex).toBe(3);

      act(() => {
        result.current.setEmotionId(0);
      });

      expect(result.current.emotionValueToStepIndex).toBe(0);
    });
  });

  /*
   * --------------------------------------------
   * Edge cases
   * --------------------------------------------
   */
  describe('edge cases', () => {
    /** Handles null date */
    it('handles null date', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ date: null }),
      });

      expect(result.current.date).toBeNull();
    });

    /** Handles empty diary entry (valid) */
    it('handles empty diary entry (valid)', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper({ initialStep: 'diary' }),
      });

      // Empty diary is valid (length <= 300)
      expect(result.current.canGoNext).toBe(true);
    });

    /** Handles multiple emotion reasons */
    it('handles multiple emotion reasons', () => {
      const { result } = renderHook(() => useEmotionRecordContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setEmotionReasons(['Work', 'Health', 'Family', 'Money']);
      });

      expect(result.current.emotionReasons).toHaveLength(4);
    });
  });
});
