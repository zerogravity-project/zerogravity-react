import { render as rtlRender, RenderOptions, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function that wraps components with necessary providers
 * Note: SessionProvider and Theme are mocked in jest.setup.ts
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Export commonly used testing utilities
export { screen, waitFor, within, fireEvent };
// Export our custom render
export { customRender as render };
