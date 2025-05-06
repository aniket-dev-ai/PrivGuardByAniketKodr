// src/components/addPassword/PasswordField.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface PasswordFieldProps {
    value: string;
    onChange: (val: string) => void;
}

export default function PasswordField({ value, onChange }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter or generate password"
                    className="pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={copyToClipboard}
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
