import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { pathToFileURL } from "url";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    reactRouter(),
    // DEV MODE - runs bootstrap before first request
    {
      name: "bootstrap-on-dev",
      apply: "serve",
      configureServer(server) {
        const bootstrapPath = pathToFileURL(path.resolve("app/shared-library/reflection-registry.service.ts")).href;
        server.watcher.once("ready", async () => {
          await server.ssrLoadModule(bootstrapPath);
          console.log("Dev Reflection engine executed successfully");
        });
      },
    },

    // PRODUCTION BUILD - run bootstrap from built JS
    {
      name: "bootstrap-on-build",
      apply: "build",
      async buildEnd() {
        const builtBootstrap = pathToFileURL(path.resolve("build/server/app/shared-library/reflection-registry.service.js")).href;

        try {
          await import(builtBootstrap);
          console.log("✔ Build Reflection engine executed successfully");
        } catch (err) {
          console.warn("⚠ Reflection engine skiped — expected compiled file not found:", builtBootstrap);
        }
      },
    },
  ],
});
