import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.querySelector('body')!).render(
  <MantineProvider>
    <App />
  </MantineProvider>
)
