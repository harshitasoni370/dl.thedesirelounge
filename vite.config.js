import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
function detectEnv(apiBaseUrl) {
  return /uat|staging|test/i.test(apiBaseUrl || "") ? "uat" : "production";
}

function banner(appEnv, apiBaseUrl) {
  const tag = appEnv === "uat" ? "UAT (testing)" : "PRODUCTION (live)";
  const line = "─".repeat(58);
  return [
    "",
    line,
    `  BUILD ENVIRONMENT : ${tag}`,
    `  API               : ${apiBaseUrl}`,
    "  API handling      : Redux direct upstream calls",
    line,
    "",
  ].join("\n");
}

function buildInfoPlugin(env) {
  const apiBaseUrl = env.VITE_API_BASE_URL;
  const appEnv = env.VITE_APP_ENV || detectEnv(apiBaseUrl);
  return {
    name: "The-desire-build-info",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "build-info.json",
        source: JSON.stringify(
          {
            appEnv,
            apiBaseUrl,
            imageBaseUrl: env.VITE_IMAGE_BASE_URL || "",
            builtAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      });
    },
    closeBundle() {
      console.log(banner(appEnv, apiBaseUrl));
    },
  };
}

function assertEnv(env) {
  if (!env.VITE_API_BASE_URL) {
    throw new Error(
      "[The-desire-lounge] .env me VITE_API_BASE_URL not get.\n" +
        "Fix: cp .env.example .env  — phir usme production ya UAT wali line uncomment karo.",
    );
  }
  if (!/^https?:\/\//i.test(env.VITE_API_BASE_URL)) {
    throw new Error(`[The-desire-lounge] VITE_API_BASE_URL valid URL nahi hai: ${env.VITE_API_BASE_URL}`);
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  assertEnv(env);

  const appEnv = env.VITE_APP_ENV || detectEnv(env.VITE_API_BASE_URL);

  if (command === "serve") {
    console.log(banner(appEnv, env.VITE_API_BASE_URL));
  }

  return {
    plugins: [react(), buildInfoPlugin(env)],
    define: { "import.meta.env.VITE_APP_ENV": JSON.stringify(appEnv) },
    build: {
      target: "es2020",
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            redux: ["@reduxjs/toolkit", "react-redux"],
          },
        },
      },
    },
    server: { port: 5173, strictPort: false },
    preview: { port: 4173 },
  };
});
