import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";

/**
 * Uses React Router's Outlet pattern — must be used as a route element directly.
 * Redirects unauthenticated users to /login.
 */
export function ProtectedRoute() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                        <span className="text-xl font-black italic text-white">L</span>
                    </div>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    // Render nested child routes (Layout → Pages)
    return <Outlet />;
}
