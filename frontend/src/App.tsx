import { Toaster } from "sonner";
import { ErrorBoundary } from "./providers/ErrorBoundary";
import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "./routes";

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Toaster position="top-right" richColors theme="dark" closeButton />
        <AppRouter />
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
