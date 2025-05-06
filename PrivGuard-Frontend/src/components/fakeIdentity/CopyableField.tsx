import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyableField({ label, value }: { label: string; value: string }) {
    const copy = () => {
        navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
    };

    return (
        <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
            <div className="flex flex-col text-left w-full">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
            <Button size="icon" variant="ghost" onClick={copy} className="ml-2">
                <Copy size={16} />
            </Button>
        </div>
    );
}
