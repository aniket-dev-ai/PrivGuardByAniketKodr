// src/components/TOTPGuard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTOTP } from "@/context/TOTPContext";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "./Navbar";

interface TOTPGuardProps {
    children: React.ReactNode;
}

const TOTPGuard: React.FC<TOTPGuardProps> = ({ children }) => {
    // ✔️ Call the hook with ()
    const { isConfirmed } = useTOTP();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);

    // 1) still loading  
    if (isConfirmed === null) {
        return null; // or a spinner
    }

    // 2) not scanned QR yet
    if (isConfirmed === false) {
        return (
            <>
            <Navbar/>
            <div className="max-w-md mx-auto text-center p-6 mt-10">
                <h2 className="text-xl font-semibold mb-4">Set up TOTP to access this page</h2>
                <Button onClick={() => navigate("/totp-setup")}>
                    Go to TOTP Setup
                </Button>
            </div>
            </>
        );
    }

    // 3) scanned but not yet verified in _this_ session
    if (!verified) {
        const handleVerify = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/totp/verify`,
                    { code },
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );
                toast.success("TOTP Verified");
                setVerified(true);
            } catch (err: any) {
                toast.error(err.response?.data?.error || "Verification failed");
            } finally {
                setLoading(false);
            }
        };

        return (
            <>
                <Navbar />
                <div className="max-w-sm mx-auto mt-10 space-y-4 text-center">
                    <h2 className="text-lg font-semibold">Enter your TOTP code</h2>
                    <Input
                        placeholder="6‑digit code"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="text-center"
                    />
                    <Button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </div>
            </>
        );
    }

    // 4) verified → render protected content
    return <>{children}</>;
};

export default TOTPGuard;
