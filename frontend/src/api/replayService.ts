import axios from 'axios';

const API_BASE = 'http://localhost:8081/replay';

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
    start: async (userId: string, symbol: string, startTime: number, speed: number = 1.0): Promise<ReplaySession> => {
        const response = await axios.post(`${API_BASE}/start`, null, {
            params: { userId, symbol, startTime, speed }
        });
        return response.data;
    },

    pause: async (sessionId: string) => {
        await axios.post(`${API_BASE}/pause/${sessionId}`);
    },

    resume: async (sessionId: string) => {
        await axios.post(`${API_BASE}/resume/${sessionId}`);
    },

    stop: async (sessionId: string) => {
        await axios.delete(`${API_BASE}/${sessionId}`);
    },

    seek: async (sessionId: string, timestamp: number) => {
        // Backend needs to support this - adding it now
        await axios.post(`${API_BASE}/seek/${sessionId}`, null, {
            params: { timestamp }
        });
    },

    setSpeed: async (sessionId: string, speed: number) => {
        await axios.post(`${API_BASE}/speed/${sessionId}`, null, {
            params: { speed }
        });
    }
};
