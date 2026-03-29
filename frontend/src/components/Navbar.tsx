import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, LineChart, LogIn, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Navbar() {
    useUser();
    const location = useLocation();
    const currentSymbol = useMarketStore((state) => state.currentSymbol);
    const holdings = usePortfolioStore((state) => state.holdings);
    const prices = useMarketStore((state) => state.prices);
    const currency = useMarketStore((state) => state.currency);
    const exchangeRate = useMarketStore((state) => state.exchangeRate);

    const navItems = [
        { name: "Terminal", path: `/trade/${currentSymbol}`, icon: LineChart },
        { name: "Portfolio", path: "/portfolio", icon: Wallet },
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
    ];

    const totalBalance = holdings.reduce((acc, h) => {
        const livePrice = prices[h.symbol] || h.avgPrice;
        const valueInUSD = h.quantity * livePrice;
        return acc + (currency === "EUR" ? valueInUSD * exchangeRate : valueInUSD);
    }, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
            <div className="flex h-16 w-full items-center justify-between px-10">
                <div className="flex items-center gap-12">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-transform group-hover:scale-110">
                            <span className="text-lg font-black text-white italic">L</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic text-white transition-colors group-hover:text-blue-400">
                            Lomboc
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path) && (item.path !== "/" || location.pathname === "/");
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                                        isActive
                                            ? "bg-white/5 text-blue-400 shadow-inner border border-white/5"
                                            : "text-zinc-500 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-zinc-600")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side Info */}
                <div className="flex items-center gap-8">
                    <div className="hidden flex-col items-end sm:flex border-r border-white/5 pr-8">
                        <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Equity Value</span>
                        <div className="text-lg font-black text-emerald-400 tabular-nums">
                            {currency === "EUR" ? "€" : "$"}
                            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-9 w-9 rounded-xl border border-white/10 ring-2 ring-blue-500/20",
                                        userButtonPopoverCard: "bg-zinc-900 border border-white/5 text-white"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-600 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
}
