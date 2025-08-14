import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './master.css';
import App from './App.jsx';
import { UserProvider } from './pages/UserContext.jsx'; // 상대경로 확인!

async function enableMocks() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
    try {
      const { worker } = await import('./mocks/browser');
      if (worker?.start) {
        await worker.start({ onUnhandledRequest: 'bypass' });
        console.log('[MSW] mock on');
      }
    } catch (e) {
      console.warn('[MSW] mock not started (missing files?)', e);
    }
  }
}

enableMocks().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </StrictMode>
  );
});
