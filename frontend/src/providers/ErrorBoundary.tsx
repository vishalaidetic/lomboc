import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-white">
                    <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
                    <p className="mb-6 text-zinc-400">
                        Please try refreshing the page or contact support if the issue
                        persists.
                    </p>
                    <button
                        onClick={() => window.location.assign("/")}
                        className="rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200 transition-colors"
                    >
                        Go Back Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
