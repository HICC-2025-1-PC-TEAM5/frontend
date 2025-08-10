import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './master.css';
import App from './App.jsx';
import { UserProvider } from '../src/pages/UserContext.jsx'; // ✅ 추가

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
