import { create } from "zustand";

interface AuthState {
    userId: string;
    isDemo: boolean;
}

export const useAuthStore = create<AuthState>(() => ({
    // In a real pro app, this would be fetched from a JWT or session
    userId: "00000000-0000-0000-0000-000000000000",
    isDemo: true,
}));
