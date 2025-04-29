import { defineConfig } from "vite";

export default defineConfig({
  base: '/townwars/',
  //root: '${workspaceFolder}',
  server: {
    proxy: {
      '/api': 'http://localhost:5172'
    }
  }
});
