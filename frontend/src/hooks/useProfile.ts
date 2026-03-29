import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
    id: string; // Internal UUID
    clerkId: string;
    email: string;
    username: string;
    profileImageUrl: string;
}

export function useProfile() {
    return useQuery({
        queryKey: ["profile", "me"],
        queryFn: async () => {
            const { data } = await api.get<UserProfile>("/user/me");
            return data;
        },
        staleTime: 60000, // 1 minute
    });
}
