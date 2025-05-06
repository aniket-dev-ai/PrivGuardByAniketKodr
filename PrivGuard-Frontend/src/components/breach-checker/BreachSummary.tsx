// src/components/breach-checker/BreachSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreachResponse } from "@/types/breach-types";
import { Shield, AlertCircle, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BreachSummaryProps {
    data: BreachResponse;
}

export default function BreachSummary({ data }: BreachSummaryProps) {
    const getRiskVariant = (label: string) => {
        switch (label) {
            case "Low": return "outline";
            case "Medium": return "secondary";
            case "High": return "default";
            case "Critical": return "destructive";
            default: return "outline";
        }
    };
    
    const getRiskScore = (score: number) => {
        return Math.min(Math.max(score, 0), 100);
    };
    
    const exposedDataCount = data.ExposedBreaches.breaches_details.length > 0
        ? data.ExposedBreaches.breaches_details[0].xposed_data.split(';').length
        : 0;
    
    const exposedDataSample = data.ExposedBreaches.breaches_details.length > 0
        ? data.ExposedBreaches.breaches_details[0].xposed_data.split(';').slice(0, 3)
        : [];

    return (
        <Card className="border shadow-sm">
            <CardHeader className="border-b">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Security Assessment Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Risk Assessment
                            </h3>
                            <Badge variant={getRiskVariant(data.BreachMetrics.risk[0].risk_label)}>
                                {data.BreachMetrics.risk[0].risk_label}
                            </Badge>
                        </div>
                        <Progress 
                            value={getRiskScore(data.BreachMetrics.risk[0].risk_score)} 
                            className="h-2"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            Score: {data.BreachMetrics.risk[0].risk_score}/100
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Breach Incidents
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-semibold">
                                {data.ExposedBreaches.breaches_details.length}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {data.ExposedBreaches.breaches_details.length === 1 
                                    ? 'incident detected' 
                                    : 'incidents detected'}
                            </span>
                        </div>
                        {data.ExposedBreaches.breaches_details.length > 0 && (
                            <p className="text-xs text-muted-foreground pt-1">
                                {/* Remove reference to breach_date since it doesn't exist in your type */}
                                Latest incident detected
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Compromised Data
                        </h3>
                        {exposedDataCount > 0 ? (
                            <>
                                <div className="space-y-1">
                                    {exposedDataSample.map((item, index) => (
                                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                                            {item.trim()}
                                        </Badge>
                                    ))}
                                    {exposedDataCount > 3 && (
                                        <Badge variant="outline" className="mr-1 mb-1">
                                            +{exposedDataCount - 3} more
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {exposedDataCount} data point{exposedDataCount !== 1 ? 's' : ''} exposed
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">No data compromised</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}