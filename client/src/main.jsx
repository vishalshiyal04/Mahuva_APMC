import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import LanguageProvider from './i18n/LanguageProvider.jsx';
import './style.css';
// createRoot(document.getElementById('root')).render(<LanguageProvider><BrowserRouter><App /></BrowserRouter></LanguageProvider>);

createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </LanguageProvider>
);