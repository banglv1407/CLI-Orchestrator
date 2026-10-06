import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { applyAppearanceSettings } from './lib/appearance';
import { initializeLanguage } from './i18n';

initializeLanguage();
applyAppearanceSettings();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
