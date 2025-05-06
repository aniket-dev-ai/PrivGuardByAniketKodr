import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"; // For better scrolling
import { Skeleton } from "@/components/ui/skeleton"; // For loading effect
import { Label } from "@/components/ui/label";


// Define the service type
interface Service {
    name: string;
    domain: string;
    logo?: string;
}

export default function WebsiteSearch({ onSelect }: { onSelect: (service: Service) => void }) {
    const [query, setQuery] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Function to fetch services
    const fetchServices = async (searchTerm: string) => {
        if (!searchTerm) {
            setServices([]);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${searchTerm}`);
            setServices(res.data);
        } catch (err) {
            setError("Failed to fetch services.");
        } finally {
            setLoading(false);
        }
    };

    // Debounce API calls
    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            fetchServices(searchTerm);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);

    return (
        <div className="relative w-full">
            <Label htmlFor="service">Website</Label>
            <Input
                id="service"
                type="text"
                autoComplete="off"
                placeholder="Search for a service..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
                <div className="mt-2 space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {services.length > 0 && (
                <Card className="absolute w-full mt-2 bg-popover shadow-lg rounded-lg z-50">
                    <CardContent className="p-2">
                        <ScrollArea className="max-h-60">
                            <ul className="space-y-1">
                                {services.map((service) => (
                                    <li
                                        key={service.domain}
                                        className="flex items-center gap-3 p-2 hover:bg-accent cursor-pointer rounded-md transition"
                                        onClick={() => {
                                            onSelect(service);
                                            setQuery(service.name);
                                            setServices([]);
                                        }}
                                    >
                                        <img
                                            src={`https://logo.clearbit.com/${service.domain}`}
                                            alt={service.name}
                                            className="w-6 h-6 rounded-md"
                                        />
                                        <span>{service.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
