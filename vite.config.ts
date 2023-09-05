import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    // your other configuration...
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                translator: resolve(__dirname, "translator/index.html"),
            },
        },
    },
});