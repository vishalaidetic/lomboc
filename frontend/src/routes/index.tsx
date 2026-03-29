import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/PageLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
// Lazy routes
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const TradePage = lazy(() => import("@/pages/TradePage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const InvestPage = lazy(() => import("@/pages/InvestPage"));
const StockDetailPage = lazy(() => import("@/pages/StockDetailPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const router = createBrowserRouter([
    // ─── Public Route ─────────────────────────────────────────────
    {
        path: "/login",
        element: (
            <Suspense fallback={<PageLoader />}>
                <LoginPage />
            </Suspense>
        ),
    },

    // ─── Protected Routes (ProtectedRoute → Layout → Pages) ───────
    {
        element: <ProtectedRoute />,      // checks auth, renders <Outlet />
        children: [
            {
                element: <Layout />,      // Navbar + footer shell, renders <Outlet />
                children: [
                    {
                        path: "/",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <HomePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/dashboard",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <DashboardPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/trade/:symbol",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <TradePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/portfolio",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <PortfolioPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/invest",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <InvestPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/invest/:symbol",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <StockDetailPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "*",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <NotFoundPage />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
