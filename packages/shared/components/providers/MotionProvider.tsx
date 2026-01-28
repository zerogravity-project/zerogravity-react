/**
 * [MotionProvider component]
 * Provides LazyMotion context with async domAnimation loading
 * Use domMax wrapper for pages requiring LayoutGroup (calendar, chart)
 */
'use client';

import type { ReactNode } from 'react';

import { LazyMotion } from 'motion/react';

/**
 * ============================================
 * Feature Loaders
 * ============================================
 */

/**
 * Async load domAnimation features
 * Supports: motion, AnimatePresence, hover/tap gestures (~15kB)
 */
const loadDomAnimation = () => import('motion/react').then(mod => mod.domAnimation);

/**
 * Async load domMax features
 * Supports: domAnimation + LayoutGroup, drag, layout animations (~25kB)
 * Use DomMaxProvider for pages that need LayoutGroup
 */
const loadDomMax = () => import('motion/react').then(mod => mod.domMax);

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * ============================================
 * Components
 * ============================================
 */

/**
 * Base motion provider with domAnimation (15kB)
 * Use at app layout level for most pages
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={loadDomAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/**
 * Extended motion provider with domMax (25kB)
 * Use for pages requiring LayoutGroup (calendar, chart)
 * Wraps content with additional layout animation support
 */
export function DomMaxProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={loadDomMax} strict>
      {children}
    </LazyMotion>
  );
}
