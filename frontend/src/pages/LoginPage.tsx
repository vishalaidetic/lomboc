import { SignIn } from "@clerk/clerk-react";
import { BarChart2, Shield, TrendingUp, Zap } from "lucide-react";

const clerkAppearance = {
    variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#18181b",
        colorText: "#ffffff",
        colorTextSecondary: "#a1a1aa",
        colorInputBackground: "#27272a",
        colorInputText: "#ffffff",
        colorNeutral: "#71717a",
        borderRadius: "0.75rem",
        fontFamily: "inherit",
        fontSize: "14px",
    },
    layout: {
        socialButtonsVariant: "blockButton" as const,
        showOptionalFields: false,
    },
};

const features = [
    { icon: Zap, text: "Sub-millisecond order matching engine", color: "#facc15", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.2)" },
    { icon: Shield, text: "Cryptographically secured via Clerk Auth", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
    { icon: BarChart2, text: "Real-time portfolio tracking with P&L", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
    { icon: TrendingUp, text: "Live Kafka-powered market data streams", color: "#c084fc", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.2)" },
];

export default function LoginPage() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#09090b", color: "#fff", fontFamily: "Inter, system-ui, sans-serif" }}>

            {/* Left Branding Panel */}
            <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px", overflow: "hidden" }}
                className="hidden lg:flex">

                {/* Glows */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                    <div style={{ position: "absolute", top: "15%", left: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
                    <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)" }} />
                </div>

                {/* Logo */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(59,130,246,0.6)" }}>
                        <span style={{ fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#fff" }}>L</span>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 900, textTransform: "uppercase", fontStyle: "italic", letterSpacing: "-0.03em", color: "#fff" }}>Lomboc</span>
                </div>

                {/* Hero */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "inline-flex", width: "fit-content", borderRadius: 999, border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.1)", padding: "6px 16px" }}>
                            <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", color: "#60a5fa" }}>Institutional Grade Terminal</span>
                        </div>
                        <h1 style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0 }}>
                            Trade at the<br />
                            <span style={{ background: "linear-gradient(135deg, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Speed of Light
                            </span>
                        </h1>
                        <p style={{ maxWidth: 380, fontSize: 16, lineHeight: 1.7, color: "#a1a1aa", margin: 0 }}>
                            Real-time order matching, sub-millisecond settlement, and professional-grade analytics — all in one platform.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {features.map(({ icon: Icon, text, color, bg, border }) => (
                            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 16, border: `1px solid ${border}`, background: bg }}>
                                <Icon style={{ width: 20, height: 20, flexShrink: 0, color }} />
                                <span style={{ fontSize: 14, fontWeight: 500, color: "#d4d4d8" }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4em", color: "#3f3f46", margin: 0 }}>
                        Lomboc // Institutional Grade Settlement // 2026
                    </p>
                </div>
            </div>

            {/* Right Clerk Panel */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                padding: "40px 24px",
                maxWidth: 520,
                width: "100%",
                borderLeft: "1px solid rgba(255,255,255,0.05)",
                background: "#09090b",
            }}>
                {/* Mobile logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }} className="lg:hidden">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#fff" }}>L</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase", fontStyle: "italic", letterSpacing: "-0.03em" }}>Lomboc</span>
                </div>

                <div style={{ width: "100%", maxWidth: 400 }}>
                    <SignIn
                        appearance={clerkAppearance}
                        routing="hash"
                        signUpUrl="/login#/sign-up"
                    />
                </div>
            </div>
        </div>
    );
}
