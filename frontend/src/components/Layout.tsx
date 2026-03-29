import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";
import { Outlet } from "react-router";

export function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white selection:bg-blue-500/30">
            {/* Custom Glow Effrect */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1">
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </main>

            {/* Subtle Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 text-center bg-zinc-950 px-10">
                <p className="text-[10px] font-black tracking-[0.5em] text-zinc-700 uppercase">
                    Lomboc Terminal // Institutional Grade Settlement // 2026
                </p>
            </footer>
        </div>
    );
}

const Loading = () => (
    <div className="flex flex-1 items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
);
