/**
 * [useKeyboardHeight hook]
 * Detect virtual keyboard height using the Visual Viewport API
 * Returns 0 when the keyboard is closed, positive value when open
 */

import { useEffect, useState } from 'react';

export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      const kbHeight = window.innerHeight - viewport.height;
      setKeyboardHeight(kbHeight > 100 ? kbHeight : 0);
    };

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  return keyboardHeight;
}
