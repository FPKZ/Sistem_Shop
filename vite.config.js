import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configura rotas alias para imports, alterações devem ser feitas no jsconfig.json ao alterar esta parte
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5888,
    hmr: {
      host: "localhost",
    },
  },
  // ============================================================================
  // CODE SPLITTING AVANÇADO (OTIMIZAÇÃO DO BUILD)
  // ============================================================================
  // O "manualChunks" orienta o Vite a não agrupar todas as bibliotecas de terceiros
  // (node_modules) em um arquivo monstruoso. Bibliotecas pesadas e de uso 
  // restrito são separadas e cacheadas independentemente pelo navegador.
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core do React, que não muda com frequência. O navegador guarda no cache.
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            // Interface estática pesada
            if (id.includes('react-bootstrap') || id.includes('bootstrap')) {
              return 'vendor-bootstrap';
            }
            // Motor de requisição de dados cacheáveis
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            // Animações
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Utilidades de uso geral
            if (id.includes('lucide-react') || id.includes('bootstrap-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('date-fns') || id.includes('jwt-decode')) {
              return 'vendor-utils';
            }
            // Bibliotecas HIPER-PESADAS e de uso super restrito.
            // Exemplos: o jsPDF tem mais de 200kb, e o Recharts gera gráficos gigantes.
            // Isolando-os aqui, o cliente que acessa o catálogo NUNCA baixa o motor de PDF do sistema.
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('react-easy-crop')) {
              return 'vendor-crop';
            }
            return 'vendor-core'; // O restante (axios, etc)
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@services": path.resolve(__dirname, "./src/services"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@tabelas": path.resolve(__dirname, "./src/components/modal/Tabelas"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@auth-sistem": path.resolve(__dirname, "./src/auth/sistem"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@assets": path.resolve(__dirname, "./public/assets"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
