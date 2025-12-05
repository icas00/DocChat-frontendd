import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const SESSION_KEY = 'docuChatSession';

export const useSession = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                // Check local storage
                const storedSession = sessionStorage.getItem(SESSION_KEY);

                if (storedSession) {
                    setSession(JSON.parse(storedSession));
                } else {
                    // Create new client
                    const newSession = await api.createClient();
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
                    setSession(newSession);
                }
            } catch (err) {
                console.error('Failed to initialize session:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initializeSession();
    }, []);

    const clearSession = () => {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.reload();
    };

    return {
        session,
        loading,
        error,
        clearSession
    };
};
