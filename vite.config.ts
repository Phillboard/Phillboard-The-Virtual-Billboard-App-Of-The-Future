
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import type { ServerOptions } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Define https configuration
  let httpsConfig: ServerOptions['https'] = undefined;
  
  if (mode === 'development') {
    try {
      // Only set up HTTPS if the certificates exist
      if (fs.existsSync('localhost-key.pem') && fs.existsSync('localhost.pem')) {
        httpsConfig = {
          key: fs.readFileSync('localhost-key.pem'),
          cert: fs.readFileSync('localhost.pem'),
        };
      } else {
        console.warn('HTTPS certificates not found. Running without HTTPS.');
      }
    } catch (error) {
      console.warn('Error loading certificates:', error);
      console.warn('Running without HTTPS.');
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
      https: httpsConfig,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
