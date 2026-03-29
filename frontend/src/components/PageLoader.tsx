
export function LoadingScreen({ message = "Synchronizing Terminal" }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden">
            {/* 1. SCIFI BACKGROUND: Animated Neural Grid */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }}
            />

            {/* 2. ATMOSPHERIC GLOWS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full animate-pulse delay-1000" />

            {/* 3. CENTER PIECE: THE CORE */}
            <div className="relative flex flex-col items-center gap-16 scale-110">

                {/* 3.1 Multi-Layered Orbiting Rings */}
                <div className="relative h-32 w-32 flex items-center justify-center">
                    {/* Ring 1: Slow Counter-Clockwise Outer */}
                    <div className="absolute h-[160%] w-[160%] rounded-full border border-dashed border-blue-500/20 animate-[spin_10s_linear_infinite_reverse]" />

                    {/* Ring 2: Medium Clockwise Outer */}
                    <div className="absolute h-[130%] w-[130%] rounded-full border-2 border-zinc-800 border-t-blue-500 animate-[spin_3s_linear_infinite]" />

                    {/* Ring 3: Fast Inner Frame */}
                    <div className="absolute h-full w-full rounded-[36px] bg-zinc-950 border border-white/5 shadow-2xl" />
                    <div className="absolute h-full w-full rounded-[36px] border-2 border-transparent border-b-blue-400 border-r-indigo-500 animate-spin" />

                    {/* The Core Logo */}
                    <div className="z-20 h-20 w-20 flex items-center justify-center rounded-[28px] bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                        <span className="text-4xl font-black text-white italic tracking-tighter drop-shadow-2xl">L</span>
                    </div>

                    {/* Laser Scanner Effect */}
                    <div className="absolute inset-0 z-30 overflow-hidden rounded-[36px]">
                        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-white/60 to-transparent absolute top-0 left-0 animate-[scanVertical_1.5s_ease-in-out_infinite]" />
                    </div>
                </div>

                {/* 4. DATA TELEMETRY (SCROLLING LOG) */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                        <h2 className="text-[14px] font-black tracking-[0.8em] text-white uppercase italic animate-pulse translate-x-[0.4em]">
                            {message}
                        </h2>
                        {/* Subtext Info */}
                        <div className="mt-4 flex flex-col items-center gap-1">
                            <p className="text-[9px] font-bold text-blue-500/60 uppercase tracking-[0.4em] animate-pulse">
                                Establishing Direct Market Access
                            </p>
                            <div className="flex gap-1">
                                <span className="h-1 w-4 bg-blue-500 rounded-full animate-pulse" />
                                <span className="h-1 w-2 bg-zinc-800 rounded-full" />
                                <span className="h-1 w-2 bg-zinc-800 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. FLOATING FRAGMENTS (PARTICLES) */}
                <div className="absolute -inset-20 pointer-events-none opacity-40">
                    <div className="absolute top-10 left-5 h-2 w-2 bg-blue-400 rounded-full blur-[1px] animate-bounce" />
                    <div className="absolute bottom-20 right-10 h-1.5 w-1.5 bg-indigo-400 rounded-full blur-[1px] animate-pulse" />
                    <div className="absolute top-1/2 -left-10 h-1 w-1 bg-white rounded-full animate-ping" />
                </div>
            </div>

            {/* 6. BOTTOM FIRMWARE INFO */}
            <div className="absolute bottom-16 flex flex-col items-center gap-3">
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.5em] whitespace-nowrap">
                    Quantum Core V4.2 // Institutional Grade Settlement // <span className="text-blue-500/50 italic font-black">Online</span>
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scanVertical {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(200%); opacity: 0; }
                }
            `}} />
        </div>
    );
}

export const PageLoader = () => <LoadingScreen />;
