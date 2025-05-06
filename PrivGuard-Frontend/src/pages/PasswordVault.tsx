import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import VaultList from "@/components/vault/VaultList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export interface VaultEntry {
    id: string;
    service: string;
    domain: string;
    logo?: string;
    notes?: string;
    password: string;
}

export default function PasswordVault() {
    const { getToken, isLoaded } = useAuth();
    const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoaded) fetchVaultData();
    }, [isLoaded]);

    const fetchVaultData = async () => {
        setLoading(true);
        setError("");
        try {
            const token = await getToken({ template: "new" });
            if (!token) throw new Error("Authentication failed");

            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault`, {
                headers: { Authorization: token },
            });

            const data = res.data.vault ?? [];
            setVaultEntries(data);
            localStorage.setItem("user_id", data[0]?.id);
            toast.success("Vault loaded successfully");
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Error loading passwords. Please try reloading.");
            toast.error("Failed to load vault");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto max-w-3xl py-8 px-4">
                <Card>
                    <CardHeader className="flex flex-col items-center">
                        <CardTitle className="text-2xl mb-2 font-bold">VAULT</CardTitle>
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                type="text"
                                placeholder="Search services or domains..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                        {loading ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="animate-spin text-gray-500" size={32} />
                            </div>
                        ) : (
                            <VaultList entries={vaultEntries} search={searchQuery} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
