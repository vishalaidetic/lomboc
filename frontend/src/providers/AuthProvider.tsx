import { api, setAuthToken } from "@/api/client";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function UserSync() {
    const { getToken, isLoaded: isAuthLoaded } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isAuthLoaded && isUserLoaded && user) {
                try {
                    const token = await getToken();
                    setAuthToken(token);

                    if (!token) return;

                    // Sync user data to backend with explicit fields
                    await api.post('/user/sync', {
                        email: user.primaryEmailAddress?.emailAddress,
                        username: user.username || user.firstName || "User",
                        profileImageUrl: user.imageUrl,
                    });
                    console.log("User sync successful");
                } catch (err) {
                    console.error("Backend user sync failed:", err);
                }
            } else if (isAuthLoaded && !user) {
                setAuthToken(null);
            }
        };

        syncUser();
    }, [isAuthLoaded, isUserLoaded, user, getToken]);

    return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <UserSync />
            {children}
        </ClerkProvider>
    );
}
