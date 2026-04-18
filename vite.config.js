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
          if (id.includes("node_modules")) {
            // Bibliotecas PESADAS e OPCIONAIS (Isoladas para performance)
            // Estas são seguras de separar pois são usadas de forma pontual
            if (id.includes("jspdf") || id.includes("html2canvas")) {
              return "vendor-heavy-pdf";
            }
            if (id.includes("recharts")) {
              return "vendor-heavy-charts";
            }
            if (id.includes("react-easy-crop")) {
              return "vendor-heavy-crop";
            }

            // TODO O RESTANTE (React, MUI, Radix, Lucide, etc)
            // Mantemos juntos para garantir que não haja quebra de referências/Hooks
            return "vendor-main";
          }
        },
      }
    }
  },
  resolve: {
    alias: {
      "@css": path.resolve(__dirname, "./public/css"),
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
