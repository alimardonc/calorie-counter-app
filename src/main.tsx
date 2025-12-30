import { ThemeProvider } from "./components/theme-provider";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./i18n.ts";
import { PostHogProvider } from "posthog-js/react";
import { registerSW } from "virtual:pwa-register";
import ToastWrapper from "./components/toast-wrapper.tsx";

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
} as const;

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark">
    <ToastWrapper />
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <div className="container mx-auto max-w-md w-full h-dvh">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </div>
    </PostHogProvider>
  </ThemeProvider>,
);
