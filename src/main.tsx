import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS animation library
AOS.init({
  duration: 800,
  easing: 'ease-out',
  once: false,
  mirror: false,
  offset: 50,
  delay: 0,
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);