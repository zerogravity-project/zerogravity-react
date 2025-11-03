import '@radix-ui/themes/styles.css';
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@zerogravity/shared/components/providers';

import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
