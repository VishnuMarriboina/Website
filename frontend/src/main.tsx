import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuthStore } from "./store/authStore";
import type { GrpcError } from "./grpc/types";
import "./index.css";

const GRPC_UNAUTHENTICATED = 16;

function isUnauthenticated(error: unknown): boolean {
  return (error as Partial<GrpcError> | null)?.code === GRPC_UNAUTHENTICATED;
}

// A stale/expired/invalid token will fail identically on every retry, and will
// keep failing for every other authenticated call until the user logs in again —
// so treat it as a session event, not a per-request error: clear the token and
// send them to log back in, instead of leaving the app silently broken.
function handleAuthError(error: unknown) {
  if (!isUnauthenticated(error)) return;

  const { token, logout } = useAuthStore.getState();
  if (token) logout();

  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) =>
        !isUnauthenticated(error) && failureCount < 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({ onError: handleAuthError }),
  mutationCache: new MutationCache({ onError: handleAuthError }),
});

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
