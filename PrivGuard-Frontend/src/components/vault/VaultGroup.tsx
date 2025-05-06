import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { VaultEntry } from "@/pages/PasswordVault";

interface VaultGroupProps {
    entries: VaultEntry[];
}

export default function VaultGroup({ entries }: VaultGroupProps) {
    const navigate = useNavigate();

    return (
        <ul className="mt-2 space-y-3">
            {entries.map((entry) => (
                <li
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/40 transition-all cursor-pointer"
                    onClick={() => navigate(`/password/${entry.id}`)}
                >
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={entry.logo || `https://logo.clearbit.com/${entry.domain}`}
                                alt={entry.service}
                                className="object-contain bg-white p-1"
                            />
                            <AvatarFallback>{entry.service[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-medium text-primary">{entry.service}</p>
                            <p className="text-xs text-muted-foreground">{entry.notes}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <ChevronRight size={24} />
                    </Button>
                </li>
            ))}
        </ul>
    );
}