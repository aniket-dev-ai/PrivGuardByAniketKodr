import { useAuth } from "@clerk/clerk-react";
import { JSX, useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

// ✅ Fixed HOC with proper typing
export function withPasskeyAuth<P extends JSX.IntrinsicAttributes>(
    WrappedComponent: React.ComponentType<P>
) {
    const PasskeyAuthHOC: React.FC<P> = (props) => {
        const { getToken } = useAuth();
        const [loading, setLoading] = useState(false);
        const [authenticated, setAuthenticated] = useState(false);
        const [error, setError] = useState("");

        // Login flow
        const handleLogin = async () => {
            setLoading(true);
            try {
                const token = await getToken({ template: "new" });

                const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/login/start`,
                    {},
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );

                const authResp = await startAuthentication(data.publicKey);

                await axios.post(
                    `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/login/finish`,
                    authResp,
                    {
                        headers: { Authorization: token },
                        withCredentials: true,
                    }
                );

                toast.success("Logged in with passkey!");
                setAuthenticated(true);
            } catch (err: any) {
                const msg = err?.response?.data?.error || err.message || "Login failed";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        // Render logic
        if (loading) {
            return (
                <>
                    <Navbar />
                    <Card className="max-w-sm mx-auto mt-10 shadow-lg">
                        <CardContent className="p-6 space-y-4 text-center">
                            <h2 className="text-lg font-semibold">Verifying passkey...</h2>
                            <p>Please complete the authentication on your device.</p>
                        </CardContent>
                    </Card>
                </>
            );
        }

        if (error && !authenticated) {
            return (
                <>
                    <Navbar />
                    <Card className="max-w-sm mx-auto mt-10 shadow-lg">
                        <CardContent className="p-6 space-y-4 text-center">
                            <h2 className="text-lg font-semibold text-red-600">Authentication Failed</h2>
                            <p>{error}</p>
                            <Button onClick={handleLogin} className="w-full">
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                </>
            );
        }

        if (authenticated) {
            return <WrappedComponent {...props} />;
        }

        return (
            <>
                <Navbar />
                <Card className="max-w-sm mx-auto mt-10 shadow-lg">
                    <CardContent className="p-6 space-y-4 text-center">
                        <h2 className="text-xl font-semibold">Secure your account</h2>
                        <p className="text-sm text-gray-500">Login with your registered passkey</p>
                        <Button
                            onClick={handleLogin}
                            disabled={loading}
                            variant="outline"
                            className="w-full"
                        >
                            {loading ? "Authenticating..." : "Login with Passkey"}
                        </Button>
                    </CardContent>
                    <CardFooter className="justify-center text-sm text-muted-foreground">
                        Don’t have a passkey?{" "}
                        <Link to="/security" className="ml-1 underline text-primary">
                            Set it up here
                        </Link>
                    </CardFooter>
                </Card>
            </>
        );
    };

    PasskeyAuthHOC.displayName = `WithPasskeyAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return PasskeyAuthHOC;
}
