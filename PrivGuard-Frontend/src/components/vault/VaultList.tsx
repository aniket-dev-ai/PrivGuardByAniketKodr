import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, KeyRound } from "lucide-react";
import { useState } from "react";
import { VaultEntry } from "@/pages/PasswordVault";

interface VaultListProps {
    entries: VaultEntry[];
    search: string;
}

export default function VaultList({ entries, search }: VaultListProps) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const filtered = entries.filter((entry) =>
        entry.service.toLowerCase().includes(search.toLowerCase()) ||
        entry.domain.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = filtered.reduce((acc, entry) => {
        if (!acc[entry.domain]) acc[entry.domain] = [];
        acc[entry.domain].push(entry);
        return acc;
    }, {} as Record<string, VaultEntry[]>);

    if (filtered.length === 0) {
        return <p className="text-center text-muted-foreground py-6">No entries found</p>;
    }

    return (
        <div className="grid gap-6">
            {Object.entries(grouped).map(([domain, entries]) => {
                const isGroup = entries.length > 1;
                const isOpen = expanded[domain];

                if (!isGroup) {
                    const entry = entries[0];
                    return (
                        <div
                            key={entry.id}
                            className="group flex items-center justify-between p-5 border rounded-3xl bg-card hover:shadow-xl transition-all cursor-pointer hover:ring-2 hover:ring-primary/30"
                            onClick={() => navigate(`/password/${entry.id}`)}
                        >
                            <div className="flex items-center gap-5">
                                <Avatar className="w-12 h-12 shadow-md">
                                    <AvatarImage
                                        src={entry.logo || `https://logo.clearbit.com/${entry.domain}`}
                                        alt={entry.service}
                                        className="object-contain bg-white p-1 rounded-full"
                                    />
                                    <AvatarFallback>{entry.service[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-lg font-semibold text-primary">{entry.service}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{entry.notes}</p>
                                </div>
                            </div>
                            <ChevronRight size={24} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                    );
                }

                return (
                    <div key={domain} className="rounded-3xl border bg-card shadow-sm">
                        <button
                            className="w-full p-6 flex items-center justify-between hover:bg-accent/60 transition-all rounded-t-3xl"
                            onClick={() => setExpanded((prev) => ({ ...prev, [domain]: !prev[domain] }))}
                        >
                            <div className="flex items-center gap-5">
                                <Avatar className="w-12 h-12 shadow-md">
                                    <AvatarImage
                                        src={`https://logo.clearbit.com/${domain}`}
                                        alt={domain}
                                        className="object-contain bg-white p-1 rounded-full"
                                    />
                                    <AvatarFallback>{domain[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <p className="text-lg font-semibold text-primary">{domain}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <KeyRound size={14} /> {entries.length} saved {entries.length > 1 ? "logins" : "login"}
                                    </p>
                                </div>
                            </div>
                            {isOpen ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                        </button>

                        {isOpen && (
                            <div className="grid gap-4 px-6 py-4 bg-muted/50 rounded-b-3xl">
                                {entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="group flex items-center justify-between p-4 border rounded-2xl bg-background hover:bg-muted/60 transition-all cursor-pointer hover:ring-1 hover:ring-primary/30"
                                        onClick={() => navigate(`/password/${entry.id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 shadow">
                                                <AvatarImage
                                                    src={entry.logo || `https://logo.clearbit.com/${entry.domain}`}
                                                    alt={entry.service}
                                                    className="object-contain bg-white p-1 rounded-full"
                                                />
                                                <AvatarFallback>{entry.service[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-primary">{entry.service}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{entry.notes}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}