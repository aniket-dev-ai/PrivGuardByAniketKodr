// src/components/PasswordBreachCheck.tsx
import { useState } from "react";
import { sha1 } from "js-sha1";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PasswordBreachCheck() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<null | number>(null);

    const checkPassword = async () => {
        if (!password) return;

        setIsLoading(true);
        setResult(null);

        try {
            const hash = sha1(password).toUpperCase();
            const prefix = hash.slice(0, 5);
            const suffix = hash.slice(5);

            const res = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
            const lines = res.data.split("\n");

            const match = lines.find((line: string ) => line.startsWith(suffix));
            const count = match ? parseInt(match.split(":")[1], 10) : 0;

            setResult(count);
            if (count > 0) {
                toast.warning(`⚠️ Found ${count} breaches for this password.`);
            } else {
                toast.success("✅ Password not found in known breaches.");
            }
        } catch (err) {
            toast.error("Failed to check password.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-card p-6 rounded-xl shadow space-y-4 max-w-md mx-auto">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-green-600" /> Password Breach Check
            </h3>

            <Input
                type="password"
                placeholder="Enter password to check..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={checkPassword} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Check Breach Status"}
            </Button>

            {result !== null && (
                <div
                    className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
                        result > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    {result > 0 ? (
                        <>
                            <ShieldAlert className="inline mr-1" /> This password has been seen{" "}
                            <span className="font-bold">{result.toLocaleString()}</span> times!
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="inline mr-1" /> Safe! No known breaches.
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
