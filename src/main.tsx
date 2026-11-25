import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { applyAppearanceSettings } from './lib/appearance';
import { initializeLanguage } from './i18n';
import {
  installNewTerminalShortcut,
  NEW_TERMINAL_EVENT,
  CYCLE_TERMINAL_EVENT,
} from './lib/terminalShortcuts';

initializeLanguage();
applyAppearanceSettings();
const removeNewTerminalShortcut = installNewTerminalShortcut(
  window,
  () => {
    window.dispatchEvent(new Event(NEW_TERMINAL_EVENT));
  },
  (step) => {
    window.dispatchEvent(new CustomEvent(CYCLE_TERMINAL_EVENT, { detail: { step } }));
  },
);
if (import.meta.hot) import.meta.hot.dispose(removeNewTerminalShortcut);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
