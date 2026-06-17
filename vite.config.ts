import { defineConfig, type Plugin } from 'vite';

// Production Content-Security-Policy. Injected only in the built output so the
// dev server (HMR websocket, inline preamble) keeps working unconstrained.
const CSP = [
  "default-src 'self' data: blob:",
  "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.firebaseio.com https://*.firebasedatabase.app https://*.googleapis.com https://api.open-meteo.com wss://*.firebaseio.com wss://*.firebasedatabase.app",
  "img-src 'self' data: blob: https:",
  "frame-src 'none'",
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '</title>',
        `</title>\n  <meta http-equiv="Content-Security-Policy" content="${CSP}">`
      );
    },
  };
}

// Relative base so the build works both as an Android (Capacitor) bundle
// loaded from the local filesystem and when hosted under a sub-path.
export default defineConfig({
  base: './',
  plugins: [cspPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
  server: {
    port: 5173,
    host: true,
  },
});
