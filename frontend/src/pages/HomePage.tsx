import { Link } from "react-router";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-white">
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-red-500/10" />

            <div className="z-10 text-center">
                <h1 className="mb-4 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
                    ANTIGRAVITY <span className="text-zinc-500">TRADING</span>
                </h1>
                <p className="mx-auto mb-10 max-w-lg text-zinc-400">
                    Professional grade, high-performance trading platform for modern traders.
                    Experience near-zero latency and beautiful real-time data flow.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/trade/BTCUSD"
                        className="rounded-full bg-white px-8 py-4 font-bold text-black transition-transform hover:scale-105"
                    >
                        Start Trading
                    </Link>
                    <Link
                        to="/portfolio"
                        className="rounded-full border border-white/20 bg-zinc-900 px-8 py-4 font-bold text-white transition-colors hover:border-white/40"
                    >
                        View Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
