// src/context/TOTPContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface TOTPContextType {
    isConfirmed: boolean | null;
    enabled: boolean | null;
    refresh: () => void;
}

const TOTPContext = createContext<TOTPContextType | undefined>(undefined);

export const TOTPProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
    const [enabled, setEnabled] = useState<boolean | null>(null);
    const { getToken } = useAuth();

    const fetchStatus = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/totp/status`,
                { headers: { Authorization: token }, withCredentials: true }
            );
            setIsConfirmed(data.isConfirmed);
            setEnabled(data.enabled);
        } catch {
            setIsConfirmed(false);
            setEnabled(false);
        }
    };

    useEffect(() => { fetchStatus() }, []);

    return (
        <TOTPContext.Provider
            value={{ isConfirmed, enabled, refresh: fetchStatus }}
        >
            {children}
        </TOTPContext.Provider>
    );
};

export const useTOTP = () => {
    const ctx = useContext(TOTPContext);
    if (!ctx) throw new Error("useTOTP must be used within TOTPProvider");
    return ctx;
};
