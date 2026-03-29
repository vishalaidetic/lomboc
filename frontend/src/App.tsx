import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthProvider";
import { ErrorBoundary } from "./providers/ErrorBoundary";
import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "./routes";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryProvider>
          <Toaster position="top-right" richColors theme="dark" closeButton />
          <AppRouter />
        </QueryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
