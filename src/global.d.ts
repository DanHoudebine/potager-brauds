/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    // Firebase compat SDK loaded via CDN <script> tags (optional).
    firebase?: any;
  }
}
