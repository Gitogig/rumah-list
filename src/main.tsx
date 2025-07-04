import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { lazy, Suspense } from 'react';

// Lazy load AOS
const initAOS = async () => {
  const AOS = (await import('aos')).default;
  import('aos/dist/aos.css');
  
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true, // Changed to true to improve performance
    mirror: false,
    offset: 50,
    delay: 0,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });
};

// Initialize AOS after main content loads
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('load', () => {
    setTimeout(initAOS, 100);
  });
}

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
  </div>}>
    <App />
  </Suspense>
);