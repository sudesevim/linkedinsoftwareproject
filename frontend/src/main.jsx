import { StrictMode, use } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

import { queryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new queryClient();

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
