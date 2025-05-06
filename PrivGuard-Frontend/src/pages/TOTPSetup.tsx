import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import QRCode from "qrcode";
import Navbar from "@/components/Navbar";
import { useTOTP } from "@/context/TOTPContext";
import { useNavigate } from "react-router-dom";

const TOTPSetup = () => {
    const { enabled: isTOTPEnabled } = useTOTP();
    const { getToken } = useAuth();
    const [qrImage, setQrImage] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already enabled
    useEffect(() => {
        if (isTOTPEnabled) {
            toast.info("TOTP already present, redirecting...");
            navigate("/");
        }
    }, [isTOTPEnabled, navigate]);

    // Fetch QR code on mount
    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/totp/setup`,
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );
                const uri = data.provisioning_uri;
                const imageUrl = await QRCode.toDataURL(uri);
                setQrImage(imageUrl);
            } catch (err) {
                toast.error("Failed to load TOTP setup");
            }
        };

        if (!isTOTPEnabled) {
            fetchQrCode();
        }
    }, [getToken, isTOTPEnabled]);

    const verifyOtp = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/totp/verify`,
                { code: otp },
                {
                    headers: { Authorization: token },
                    withCredentials: true,
                }
            );

            if (data.message) {
                toast.success("TOTP Verified and Enabled");
                window.location.href = "/security";
            } else {
                toast.error("Invalid code");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Card className="max-w-md mx-auto mt-10 shadow-lg">
                <CardContent className="p-6 space-y-6 text-center">
                    <h2 className="text-xl font-semibold">Set up TOTP (Google Authenticator)</h2>
                    {qrImage ? (
                        <img
                            src={qrImage}
                            alt="Scan this QR code in Google Authenticator"
                            className="mx-auto"
                        />
                    ) : (
                        <p>Loading QR Code...</p>
                    )}

                    <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center"
                        maxLength={6}
                    />
                    <Button onClick={verifyOtp} disabled={loading} className="w-full">
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};

export default TOTPSetup;
