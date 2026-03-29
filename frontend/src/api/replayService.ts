import { api } from './client';

export interface ReplaySession {
    id: string;
    userId: string;
    symbol: string;
    startTime: number;
    currentTime: number;
    speed: number;
    running: boolean;
    createdAt: string;
}

export const replayService = {
    start: async (symbol: string, startTime: number, speed: number = 1.0): Promise<ReplaySession> => {
        const { data } = await api.post<ReplaySession>(`/replay/start`, null, {
            params: { symbol, startTime, speed }
        });
        return data;
    },

    pause: async (sessionId: string) => {
        await api.post(`/replay/pause/${sessionId}`);
    },

    resume: async (sessionId: string) => {
        await api.post(`/replay/resume/${sessionId}`);
    },

    stop: async (sessionId: string) => {
        await api.delete(`/replay/stop/${sessionId}`);
    },

    seek: async (sessionId: string, timestamp: number) => {
        await api.post(`/replay/seek/${sessionId}`, null, {
            params: { timestamp }
        });
    },

    setSpeed: async (sessionId: string, speed: number) => {
        await api.post(`/replay/speed/${sessionId}`, null, {
            params: { speed }
        });
    }
};
