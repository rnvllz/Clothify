import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { CartProvider } from "./context/CartContext.tsx";
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Toaster position="top-right" />
    </CartProvider>
  </StrictMode>,
);
