// src/components/addPassword/SelectedServicePreview.tsx
import { Button } from "@/components/ui/button";

interface Service {
    name: string;
    domain: string;
    logo?: string;
}

interface Props {
    service: Service;
    onClear: () => void;
}

export default function SelectedServicePreview({ service, onClear }: Props) {
    return (
        <div className="mt-2 flex items-center gap-3 rounded-lg border px-4 py-2 bg-muted">
            <img
                src={service.logo || `https://logo.clearbit.com/${service.domain}`}
                alt={service.name}
                className="w-8 h-8 rounded-md border"
            />
            <span className="font-medium">{service.name}</span>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={onClear}>
                Change
            </Button>
        </div>
    );
}
