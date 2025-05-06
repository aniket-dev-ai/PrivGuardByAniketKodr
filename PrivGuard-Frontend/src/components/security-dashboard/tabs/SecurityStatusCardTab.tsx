import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    KeyRound,
    Fingerprint,
    Lock,
    Shield,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Service = {
    service_name: string;
    logo_url: string;
    strength_score: number;
};

type AssessmentResponse = {
    average_score: number;
    passkey_count: number;
    service_count: number;
    services: Service[];
};

const SecurityStatusCardTab = () => {
    const { getToken } = useAuth();
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const getSecurityAssessment = async () => {
        try {
            const token = await getToken({ template: "new" });
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ADDR}/api/auth/assesment`, {
                headers: { Authorization: token },
                withCredentials: true,
            });
            setAssessment(res.data);
        } catch (err) {
            toast.error("Failed to load Security Status");
        }
    };

    useEffect(() => {
        getSecurityAssessment();
    }, []);

    const getScoreLabel = (score: number): string => {
        if (score < 40) return "At Risk";
        if (score < 70) return "Adequate";
        return "Optimal";
    };

    const getColor = (score: number) => {
        if (score < 40) return "red";
        if (score < 70) return "amber";
        return "emerald";
    };

    const MotionCard = motion.create(Card);

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border-muted/30 backdrop-blur-sm bg-card/90"
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Security Status</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Shield size={12} className="text-primary" />
                        Enterprise Protection
                    </Badge>
                </div>
                <CardDescription>Overview of your account's security posture</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="text-muted-foreground/20"
                                strokeWidth="10"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className={`text-${getColor(assessment?.average_score || 0)}-500`}
                                strokeWidth="10"
                                strokeDasharray={`${(assessment?.average_score || 0) * 2.51} 251`}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold">{(assessment?.average_score ?? 0).toFixed(1)}%</span>
                            <span className="text-xs text-muted-foreground">{getScoreLabel(assessment?.average_score ?? 0)}</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="space-y-3">
                            <SecurityFeatureProgress
                                icon={<KeyRound size={16} className="text-amber-500" />}
                                name="Passkey Authentication"
                                status={`${assessment?.passkey_count ?? 0} of 2`}
                                progress={(assessment?.passkey_count ?? 0) * 50}
                                variant="amber"
                            />
                            <SecurityFeatureProgress
                                icon={<Fingerprint size={16} className="text-emerald-500" />}
                                name="TOTP Authentication"
                                status="Enabled"
                                progress={100}
                                variant="emerald"
                            />
                            <SecurityFeatureProgress
                                icon={<Lock size={16} className="text-emerald-500" />}
                                name="Password Strength"
                                status={`${(assessment?.average_score ?? 0).toFixed(1)}%`}
                                progress={assessment?.average_score ?? 0}
                                variant={getColor(assessment?.average_score || 0) as "red" | "amber" | "emerald"}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button
                        variant="outline"
                        className="text-sm"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? "Hide Details" : "View Services"}
                        {showDetails ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                </div>

                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-4"
                        >
                            <div className="max-h-56 overflow-y-auto space-y-2 border rounded-lg p-3">
                                {assessment?.services.map((service, i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <img src={service.logo_url} alt={service.service_name} className="w-6 h-6 rounded" />
                                            <span className="text-sm font-medium">{service.service_name}</span>
                                        </div>
                                        <Badge
                                            className={`text-xs border-${getColor(service.strength_score)}-500/30 bg-${getColor(service.strength_score)}-500/10 text-${getColor(service.strength_score)}-500`}
                                            variant="outline"
                                        >
                                            {service.strength_score}%
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </MotionCard>
    );
};

const SecurityFeatureProgress = ({
    icon,
    name,
    status,
    progress,
    variant,
}: {
    icon: React.ReactNode;
    name: string;
    status: string;
    progress: number;
    variant: "red" | "amber" | "emerald";
}) => {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm font-medium">{name}</span>
                </div>
                <Badge
                    variant="outline"
                    className={`text-${variant}-500 border-${variant}-500/20 bg-${variant}-500/10 text-xs`}
                >
                    {status}
                </Badge>
            </div>
            <Progress value={progress} className="h-1.5" />
        </div>
    );
};

export default SecurityStatusCardTab;
