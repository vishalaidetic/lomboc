import {
    Activity,
    ArrowRight,
    ChevronRight,
    Cpu,
    Database,
    Globe,
    ShieldCheck,
    Workflow,
    Zap
} from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#02040a] p-6 text-white relative overflow-hidden">

            {/* Scientific Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                {/* HUD Grid */}
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]" />

                {/* Horizontal Scanning Laser */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/20 animate-[scan_10s_linear_infinite]" />

                {/* Environmental Glows */}
                <div className="absolute top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-blue-600/[0.03] blur-[250px] rounded-full" />
                <div className="absolute bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[250px] rounded-full" />
            </div>

            {/* Float HUD Marks */}
            <div className="absolute top-20 right-20 opacity-[0.03] animate-pulse pointer-events-none">
                <Database className="w-32 h-32" />
            </div>
            <div className="absolute bottom-20 left-20 opacity-[0.03] animate-pulse pointer-events-none">
                <Workflow className="w-32 h-32" />
            </div>

            <main className="z-10 flex flex-col items-center text-center max-w-6xl">

                {/* System Status HUD Label */}
                <div className="mb-10 flex items-center gap-3 px-6 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl animate-bounce-subtle">
                    <Activity className="h-3 w-3 text-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">System_Node_0xAF_Active</span>
                </div>

                {/* Hero kinetic Typography */}
                <h1 className="mb-8 text-7xl font-black tracking-tighter sm:text-8xl lg:text-[140px] leading-[0.85] uppercase italic group">
                    LOMBOC <span className="text-zinc-800 transition-colors group-hover:text-blue-500/20">TRADING</span>
                </h1>

                {/* Scientific Decription */}
                <p className="mx-auto mb-16 max-w-2xl text-base font-bold text-zinc-500 uppercase tracking-[0.3em] leading-relaxed">
                    Direct Exchange Access // Institutional Settlement Engine // Real-time Telemetry Control
                </p>

                {/* CTA Action Deck */}
                <div className="flex flex-wrap items-center justify-center gap-8 mb-24">
                    <Link
                        to="/trade/BTCUSD"
                        className="group relative flex items-center gap-4 rounded-full bg-blue-600 px-12 py-6 text-xs font-black uppercase tracking-[0.4em] text-white shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10">Access Terminal</span>
                        <ChevronRight className="relative z-10 h-4 w-4" />
                    </Link>

                    <Link
                        to="/invest"
                        className="group flex items-center gap-4 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-3xl px-12 py-6 text-xs font-black uppercase tracking-[0.4em] text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white hover:border-white/10"
                    >
                        Explore Assets
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Technical Feature Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full border-t border-white/5 pt-20">
                    {[
                        { icon: ShieldCheck, label: "Secure Settlement", desc: "Enterprise-grade L1 encryption for direct bank-to-terminal clears." },
                        { icon: Zap, label: "Zero-Point Latency", desc: "Engineered for 20ms execution via high-speed clearing node 0xAF." },
                        { icon: Globe, label: "Global Liquidity", desc: "Synthetic deep-order-book access across five major global exchanges." },
                        { icon: Workflow, label: "Asset Orchestration", desc: "Manage equities and crypto through a single high-fidelity node." }
                    ].map((feature, i) => (
                        <div key={i} className="group relative rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl text-left transition-all hover:bg-zinc-900/20 hover:border-blue-500/20 overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.1] transition-opacity">
                                <Cpu className="w-16 h-16" />
                            </div>
                            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/5 text-blue-500 border border-white/10 transition-transform group-hover:scale-110">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-white">{feature.label}</h3>
                            <p className="text-[10px] font-bold leading-relaxed text-zinc-500 uppercase tracking-widest">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Bottom Footer Telemetry */}
            <footer className="z-10 mt-24 border-t border-white/5 pt-12 w-full max-w-6xl flex justify-between items-center opacity-30 select-none pointer-events-none">
                <div className="flex gap-10">
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Node_ID: 0xAF_ACTIVE</span>
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Security_Protocol: AES_BLOCK</span>
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none italic">© 2026 Lomboc Scientific</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">DMA_OK</span>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                .animate-bounce-subtle {
                    animation: bounceSubtle 3s ease-in-out infinite;
                }
                @keyframes bounceSubtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}} />
        </div>
    );
}
