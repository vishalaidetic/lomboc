import { replayService, ReplaySession } from "@/api/replayService";
import { cn } from "@/lib/utils";
import { FastForward, Pause, Play, StopCircle, Timer } from "lucide-react";
import { useState } from "react";

interface SimulationControlsProps {
    userId: string;
    symbol: string;
}

export function SimulationControls({ userId, symbol }: SimulationControlsProps) {
    const [activeSession, setActiveSession] = useState<ReplaySession | null>(null);

    const handleStart = async (speed: number = 1.0) => {
        // Start from 1 hour ago
        const startTime = Date.now() - (3600 * 1000);
        const session = await replayService.start(userId, symbol, startTime, speed);
        setActiveSession(session);
    };

    const togglePlayback = async () => {
        if (!activeSession) return;
        if (activeSession.running) {
            await replayService.pause(activeSession.id);
            setActiveSession({ ...activeSession, running: false });
        } else {
            await replayService.resume(activeSession.id);
            setActiveSession({ ...activeSession, running: true });
        }
    };

    const handleStop = async () => {
        if (!activeSession) return;
        await replayService.stop(activeSession.id);
        setActiveSession(null);
    };

    if (!activeSession) {
        return (
            <button
                onClick={() => handleStart(1.0)}
                className="group flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all hover:bg-blue-500 hover:text-white shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] border-b-4 border-blue-700 active:translate-y-1 active:border-b-0"
            >
                <Timer className="h-4 w-4" />
                Start Simulation
            </button>
        );
    }

    return (
        <div className="flex items-center gap-4 rounded-[32px] border border-white/10 bg-zinc-900/60 p-2 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

            {/* Playback Progress Indicator */}
            <div className="flex flex-col px-4 border-r border-white/5">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Status</span>
                <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter",
                    activeSession.running ? "text-emerald-400 animate-pulse" : "text-yellow-400"
                )}>
                    {activeSession.running ? "Streaming" : "Paused"}
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={togglePlayback}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
                >
                    {activeSession.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                </button>

                <button
                    className="flex h-10 px-4 items-center gap-2 rounded-full bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition-all font-black text-[10px] active:scale-95"
                >
                    <FastForward className="h-4 w-4" />
                    {activeSession.speed}x
                </button>

                <button
                    onClick={handleStop}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all active:scale-90"
                >
                    <StopCircle className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
