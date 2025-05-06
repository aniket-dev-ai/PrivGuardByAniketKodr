// src/components/breach-checker/NoBreachesFound.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface NoBreachesFoundProps {
    email: string;
}

export default function NoBreachesFound({ email }: NoBreachesFoundProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="bg-green-50 p-3 rounded-full mb-4">
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Good News!</h3>
                    <p className="text-slate-600 max-w-md">
                        No data breaches were found for <strong>{email}</strong>. Your email appears to be secure.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}