// src/components/breach-checker/BreachTimeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { YearwiseDetails } from "@/types/breach-types";

interface BreachTimelineProps {
    yearwiseDetails: YearwiseDetails;
}

export default function BreachTimeline({ yearwiseDetails }: BreachTimelineProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Breach Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                {yearwiseDetails && (
                    <div className="space-y-3">
                        {Object.entries(yearwiseDetails)
                            .filter(([_, value]) => value > 0)
                            .sort((a, b) => Number(a[0].substring(1)) - Number(b[0].substring(1)))
                            .map(([year, count]) => (
                                <div key={year} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>{year.substring(1)}</span>
                                        <span>{count} breach{count > 1 ? 'es' : ''}</span>
                                    </div>
                                    <Progress value={count * 25} className="h-2" />
                                </div>
                            ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}