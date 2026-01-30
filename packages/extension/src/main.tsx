import '@radix-ui/themes/styles.css';
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { MotionProvider } from '@zerogravity/shared/components/providers';

import App from './App';
import { ThemeProviderAdapter } from './components/providers/ThemeProviderAdapter';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderAdapter>
      <MotionProvider>
        <App />
      </MotionProvider>
    </ThemeProviderAdapter>
  </StrictMode>
);
