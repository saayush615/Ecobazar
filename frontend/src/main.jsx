import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext'
import { Provider } from 'react-redux'
import { store } from './store/store';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>

      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
