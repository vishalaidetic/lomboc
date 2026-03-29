import { usePortfolio } from "@/hooks/usePortfolio";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import {
    Activity,
    Building2,
    Clock,
    LayoutDashboard,
    LineChart,
    LogIn,
    ShieldCheck,
    Wallet
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

export function Navbar() {
    useUser();
    const location = useLocation();
    const currentSymbol = useMarketStore((state) => state.currentSymbol);
    const setPortfolio = usePortfolioStore((state) => state.setPortfolio);
    const holdings = usePortfolioStore((state) => state.holdings);
    const prices = useMarketStore((state) => state.prices);
    const currency = useMarketStore((state) => state.currency);
    const exchangeRate = useMarketStore((state) => state.exchangeRate);
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const { data: initialPortfolio } = usePortfolio();
    useEffect(() => {
        if (initialPortfolio) setPortfolio(initialPortfolio.holdings);
    }, [initialPortfolio, setPortfolio]);

    const navItems = [
        { name: "Terminal", path: `/trade/${currentSymbol}`, icon: LineChart },
        { name: "Invest", path: "/invest", icon: Building2 },
        { name: "Portfolio", path: "/portfolio", icon: Wallet },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ];

    const totalBalance = holdings.reduce((acc, h) => {
        const livePrice = prices[h.symbol] || h.avgPrice;
        const valueInUSD = h.quantity * livePrice;
        return acc + (currency === "EUR" ? valueInUSD * exchangeRate : valueInUSD);
    }, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/40 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="flex h-16 w-full items-center justify-between px-10 relative overflow-hidden">

                {/* Background HUD Marks */}
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="flex items-center gap-12 relative z-10">
                    <Link to="/" className="flex items-center gap-4 group/logo">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all group-hover/logo:scale-110 relative overflow-hidden">
                            <span className="text-xl font-black text-white italic relative z-10">L</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tighter uppercase italic leading-none text-white">Lomboc</span>
                            <span className="text-[8px] font-black tracking-[0.4em] text-blue-500 uppercase">Scientific Terminal</span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex border-l border-white/5 pl-8">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path) && (item.path !== "/" || location.pathname === "/");
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 relative group/item",
                                        isActive ? "text-blue-400" : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-3.5 w-3.5", isActive ? "text-blue-400" : "text-zinc-600 group-hover/item:text-white")} />
                                    {item.name}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-10 relative z-10">
                    <div className="hidden lg:flex items-center gap-8 border-r border-white/5 pr-8">
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-zinc-500" />
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">UTC Sync</span>
                            </div>
                            <span className="text-xs font-mono text-zinc-400 font-bold">{time}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Engine Status</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase text-emerald-400">0x4F_ACTIVE</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Institutional Equity</span>
                        <div className="text-xl font-black text-white tabular-nums tracking-tighter">
                            <span className="text-blue-500 mr-1">{currency === "EUR" ? "€" : "$"}</span>
                            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-10 w-10 rounded-xl border-2 border-white/5 ring-4 ring-blue-500/5 hover:ring-blue-500/20 transition-all",
                                        userButtonPopoverCard: "bg-zinc-950 border border-white/10 backdrop-blur-3xl text-white shadow-2xl rounded-3xl"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="flex h-11 items-center gap-3 rounded-xl bg-blue-600 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.4)] relative overflow-hidden group/btn">
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    <LogIn className="h-4 w-4 relative z-10" />
                                    <span className="relative z-10">Access Terminal</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>

                <div className="absolute top-0 right-0 p-1 opacity-20">
                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                </div>
            </div>
        </nav>
    );
}
