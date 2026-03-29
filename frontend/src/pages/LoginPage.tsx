import { SignIn } from "@clerk/clerk-react";
import { Globe, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const clerkAppearance = {
    variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#09090b",
        colorText: "#ffffff",
        colorInputBackground: "#18181b",
        colorInputText: "#ffffff",
        borderRadius: "0.5rem",
    },
    elements: {
        card: "bg-transparent shadow-none border-none",
        headerTitle: "text-white font-bold text-xl",
        headerSubtitle: "text-zinc-500",
        socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10",
        socialButtonsBlockButtonText: "text-white font-bold",
        formButtonPrimary: "bg-blue-600 hover:bg-blue-500",
        formFieldLabel: "text-zinc-400 font-medium",
        formFieldInput: "bg-white/5 border-white/10 text-white",
    }
};

const mockTicker = [
    { symbol: "BTC", price: "64,231.50", change: "+2.4%" },
    { symbol: "ETH", price: "3,452.12", change: "-0.8%" },
    { symbol: "AAPL", price: "189.43", change: "+1.2%" },
    { symbol: "NVDA", price: "874.11", change: "+4.5%" },
    { symbol: "EUR/USD", price: "1.0821", change: "-0.1%" },
    { symbol: "TSLA", price: "172.54", change: "-2.3%" },
    { symbol: "SOL", price: "145.20", change: "+5.1%" },
];

export default function LoginPage() {
    const [prices, setPrices] = useState(mockTicker);

    // Mock live price noise
    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => prev.map(p => ({
                ...p,
                price: (parseFloat(p.price.replace(',', '')) + (Math.random() - 0.5) * 5).toLocaleString(undefined, { minimumFractionDigits: 2 })
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#02040a] text-white selection:bg-blue-500/30 overflow-hidden">

            {/* 1. Dynamic Market Ticker */}
            <div className="flex min-h-[40px] w-full border-b border-white/5 bg-zinc-950/50 backdrop-blur-md overflow-hidden relative z-50">
                <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap py-2.5">
                    {[...prices, ...prices].map((item, i) => (
                        <div key={i} className="mx-8 flex items-center gap-2.5">
                            <span className="font-black tracking-tighter text-[11px] uppercase">{item.symbol}</span>
                            <span className="font-mono text-[11px] text-zinc-400">${item.price}</span>
                            <span className={`text-[10px] font-bold ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {item.change}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative flex flex-1 flex-col lg:flex-row h-full">
                {/* 2. Visual Background Layer (Live Chart) */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <svg className="h-full w-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0 500 Q 200 400, 400 500 T 800 400 T 1200 600 T 1600 500 V 1000 H 0 Z"
                            fill="url(#chartGradient)"
                            className="animate-[wave_10s_ease-in-out_infinite]"
                        />
                    </svg>
                    <div className="absolute inset-0 bg-[#02040a]/40 backdrop-blur-[2px]" />
                </div>

                {/* Left Section: Hero */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-10 lg:px-20 py-20">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                            <span className="text-2xl font-black italic">L</span>
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Lomboc Terminal</h1>
                    </div>

                    <div className="flex flex-col gap-6 max-w-2xl">
                        <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                            Unified <br />
                            <span className="text-blue-500">Exchange</span>
                        </h2>
                        <p className="text-lg lg:text-xl text-zinc-400 font-medium leading-relaxed max-w-lg">
                            Institutional-grade crypto trading and professional stock investing in one seamless terminal.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:-translate-y-2 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-300 group">
                                <Zap className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Execution</span>
                                    <span className="font-bold text-lg">Sub-ms Speed</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:-translate-y-2 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-300 group">
                                <Globe className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Exposure</span>
                                    <span className="font-bold text-lg">Global Markets</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:-translate-y-2 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-300 group">
                                <Shield className="h-6 w-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security</span>
                                    <span className="font-bold text-lg">Bank-Grade</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-1 items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-lg rounded-[48px] border border-white/10 bg-zinc-950/60 p-16 backdrop-blur-3xl shadow-2xl relative group overflow-hidden border-b-blue-600/50 border-b-2">
                        {/* Interactive HUD Marks */}
                        <div className="absolute top-8 left-8 text-[9px] font-black text-zinc-700 tracking-[0.2em] uppercase">Auth Terminal V4</div>
                        <div className="absolute top-0 right-0 p-8 opacity-30">
                            <Zap className="h-6 w-6 text-blue-500 animate-pulse" />
                        </div>

                        <div className="mb-12">
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-3 text-white">Market Access</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-blue-600" />
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Identity Handshake Sequence Initiated</p>
                            </div>
                        </div>

                        <div className="relative z-10 scale-110 origin-top">
                            <SignIn appearance={clerkAppearance} routing="hash" signUpUrl="/login#/sign-up" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-10 flex justify-between items-center pointer-events-none opacity-20">
                <span className="text-[9px] font-black tracking-[0.5em] uppercase">Integrated Trading Terminal v4.0</span>
                <div className="flex gap-4">
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase">Kafka Streams</span>
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase">Matching Engine</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes wave {
                    0% { transform: translateY(0) scaleX(1); }
                    50% { transform: translateY(-50px) scaleX(1.1); }
                    100% { transform: translateY(0) scaleX(1); }
                }
            `}} />
        </div>
    );
}
