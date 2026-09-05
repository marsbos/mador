import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  server: {
    open: "/examples/mador.html",
    watch: {
      ignored: ["!**/dist/**"],
    },
  },
});
