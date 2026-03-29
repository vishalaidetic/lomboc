import { PageLoader } from "@/components/PageLoader";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";


export function ProtectedRoute() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return <PageLoader />;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
