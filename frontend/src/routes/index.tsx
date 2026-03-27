import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

// Lazy routes
const HomePage = lazy(() => import("@/pages/HomePage"));
const TradePage = lazy(() => import("@/pages/TradePage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const Loading = () => (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loading />}>
                <HomePage />
            </Suspense>
        ),
    },
    {
        path: "/trade/:symbol",
        element: (
            <Suspense fallback={<Loading />}>
                <TradePage />
            </Suspense>
        ),
    },
    {
        path: "/portfolio",
        element: (
            <Suspense fallback={<Loading />}>
                <PortfolioPage />
            </Suspense>
        ),
    },
    {
        path: "*",
        element: (
            <Suspense fallback={<Loading />}>
                <NotFoundPage />
            </Suspense>
        ),
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
