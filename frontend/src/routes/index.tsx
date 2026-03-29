import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

// Lazy routes
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const TradePage = lazy(() => import("@/pages/TradePage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
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

function PageLoader() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
                background: "#09090b",
            }}
        >
            <div
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.1)",
                    borderTop: "2px solid #3b82f6",
                    animation: "spin 0.8s linear infinite",
                }}
            />
        </div>
    );
}
