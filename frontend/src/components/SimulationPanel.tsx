import { replayService, type ReplaySession } from "@/api/replayService";
import { cn } from "@/lib/utils";
import { History, Pause, Play, StopCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SimulationPanelProps {
    userId: string;
    symbol: string;
}

export function SimulationPanel({ userId, symbol }: SimulationPanelProps) {
    const [activeSession, setActiveSession] = useState<ReplaySession | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const timelineRef = useRef<HTMLInputElement>(null);

    // Sync current time from session (Polling for accurate timeline sync)
    useEffect(() => {
        let interval: any;
        if (activeSession && activeSession.running) {
            interval = setInterval(() => {
                setCurrentTime(prev => prev + (1000 * (activeSession.speed / 10))); // Approx UI update
            }, 100);
        }
        return () => clearInterval(interval);
    }, [activeSession]);

    const handleStart = async (speed: number = 1.0) => {
        const oneHourAgo = Date.now() - (3600 * 1000);
        const session = await replayService.start(userId, symbol, oneHourAgo, speed);
        setActiveSession(session);
        setCurrentTime(oneHourAgo);
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

    const handleSeek = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!activeSession) return;
        const newTime = parseInt(e.target.value);
        setCurrentTime(newTime);
        await replayService.seek(activeSession.id, newTime);
    };

    const handleSpeedChange = async (newSpeed: number) => {
        if (!activeSession) return;
        await replayService.setSpeed(activeSession.id, newSpeed);
        setActiveSession({ ...activeSession, speed: newSpeed });
    };

    const handleStop = async () => {
        if (!activeSession) return;
        await replayService.stop(activeSession.id);
        setActiveSession(null);
    };

    if (!activeSession) {
        return (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => handleStart(1.0)}
                    className="flex items-center gap-3 rounded-2xl bg-blue-500 px-6 py-3 font-black text-xs uppercase tracking-widest text-white shadow-2xl hover:bg-blue-600 transition-all active:scale-95 border-b-4 border-blue-800"
                >
                    <History className="h-4 w-4" />
                    Enter Simulation Mode
                </button>
            </div>
        );
    }

    const duration = 3600 * 1000; // 1 hour window
    const progress = ((currentTime - activeSession.startTime) / duration) * 100;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-t border-white/20">
                <div className="flex items-center gap-8">
                    {/* Status & Playback */}
                    <div className="flex items-center gap-4 border-r border-white/5 pr-8">
                        <button
                            onClick={togglePlayback}
                            className={cn(
                                "flex h-14 w-14 items-center justify-center rounded-full transition-all active:scale-90",
                                activeSession.running ? "bg-white text-black" : "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            )}
                        >
                            {activeSession.running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-white ml-1" />}
                        </button>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mode</span>
                            <span className="text-sm font-black text-white uppercase italic">Rewind: {symbol}</span>
                        </div>
                    </div>

                    {/* Timeline Container */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <span>{new Date(activeSession.startTime).toLocaleTimeString()}</span>
                            <span className="text-blue-400 font-mono text-xs">{new Date(currentTime).toLocaleTimeString()}</span>
                            <span>Live</span>
                        </div>

                        <div className="relative group/timeline h-6 flex items-center">
                            <input
                                type="range"
                                min={activeSession.startTime}
                                max={activeSession.startTime + duration}
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div
                                className="pointer-events-none absolute left-0 h-1 bg-blue-500 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Speed & Controls */}
                    <div className="flex items-center gap-6 border-l border-white/5 pl-8">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-zinc-600 uppercase mb-2">Warp</span>
                            <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
                                {[1, 10, 100].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleSpeedChange(s)}
                                        className={cn(
                                            "px-3 py-1 rounded-lg text-[10px] font-black transition-all",
                                            activeSession.speed === s ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-600 hover:text-white"
                                        )}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStop}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all active:scale-95 border border-rose-500/20 shadow-xl"
                        >
                            <StopCircle className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
