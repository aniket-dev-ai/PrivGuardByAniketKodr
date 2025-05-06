// src/components/breach-checker/EmailSearchForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EmailSearchFormProps {
    email: string;
    setEmail: (email: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

export default function EmailSearchForm({ email, setEmail, onSubmit, loading }: EmailSearchFormProps) {
    return (
        <div className="flex gap-2">
            <Input
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            />
            <Button onClick={onSubmit} disabled={loading || !email}>
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                Check
            </Button>
        </div>
    );
}