// src/components/breach-checker/PasswordAnalysis.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { PasswordStrength } from "@/types/breach-types";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PasswordAnalysisProps {
    passwordStrength: PasswordStrength;
}

export default function PasswordAnalysis({ passwordStrength }: PasswordAnalysisProps) {
    // Calculate total passwords for percentage calculations
    const totalPasswords = passwordStrength ? 
        passwordStrength.PlainText + 
        passwordStrength.EasyToCrack + 
        passwordStrength.StrongHash + 
        passwordStrength.Unknown : 0;
    
    // Calculate security score (higher = better)
    const securityScore = totalPasswords > 0 ? 
        Math.round((passwordStrength.StrongHash / totalPasswords) * 100) : 0;
    
    // Security level determination
    const getSecurityLevel = (score: number) => {
        if (score >= 75) return { label: "Good", variant: "outline" };
        if (score >= 40) return { label: "Moderate", variant: "secondary" };
        return { label: "At Risk", variant: "destructive" };
    };
    
    const securityLevel = getSecurityLevel(securityScore);

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-medium">Password Security Analysis</CardTitle>
                        <CardDescription className="mt-1">
                            Analysis of password storage security across breached services
                        </CardDescription>
                    </div>
                    <Badge variant={securityLevel.variant as any}>
                        {securityLevel.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {passwordStrength && (
                    <>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">Security Score</span>
                                    <span>{securityScore}%</span>
                                </div>
                                <Progress value={securityScore} className="h-2" />
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <SecurityMetric 
                                    icon={<AlertCircle className="h-4 w-4" />}
                                    label="Plain Text" 
                                    value={passwordStrength.PlainText}
                                    percentage={totalPasswords > 0 ? Math.round((passwordStrength.PlainText / totalPasswords) * 100) : 0}
                                    variant="destructive"
                                />
                                
                                <SecurityMetric 
                                    icon={<Shield className="h-4 w-4" />}
                                    label="Easy To Crack" 
                                    value={passwordStrength.EasyToCrack}
                                    percentage={totalPasswords > 0 ? Math.round((passwordStrength.EasyToCrack / totalPasswords) * 100) : 0}
                                    variant="secondary"
                                />
                                
                                <SecurityMetric 
                                    icon={<CheckCircle className="h-4 w-4" />}
                                    label="Strong Hash" 
                                    value={passwordStrength.StrongHash}
                                    percentage={totalPasswords > 0 ? Math.round((passwordStrength.StrongHash / totalPasswords) * 100) : 0} 
                                    variant="outline"
                                />
                                
                                <SecurityMetric 
                                    icon={<HelpCircle className="h-4 w-4" />}
                                    label="Unknown" 
                                    value={passwordStrength.Unknown}
                                    percentage={totalPasswords > 0 ? Math.round((passwordStrength.Unknown / totalPasswords) * 100) : 0}
                                    variant="default"
                                />
                            </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Password Security Definitions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                <DefinitionItem 
                                    icon={<AlertCircle className="h-4 w-4" />}
                                    title="Plain Text" 
                                    description="Passwords stored without encryption. Highest risk if breached." 
                                    variant="destructive"
                                />
                                
                                <DefinitionItem 
                                    icon={<Shield className="h-4 w-4" />}
                                    title="Easy To Crack" 
                                    description="Basic hashing that can be broken with computational resources." 
                                    variant="secondary"
                                />
                                
                                <DefinitionItem 
                                    icon={<CheckCircle className="h-4 w-4" />}
                                    title="Strong Hash" 
                                    description="Properly encrypted passwords with modern cryptographic methods." 
                                    variant="outline"
                                />
                                
                                <DefinitionItem 
                                    icon={<HelpCircle className="h-4 w-4" />}
                                    title="Unknown" 
                                    description="Security method could not be determined from breach data." 
                                    variant="default"
                                />
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// Helper component for consistent security metrics display
interface SecurityMetricProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    percentage: number;
    variant: "destructive" | "default" | "outline" | "secondary";
}

function SecurityMetric({ icon, label, value, percentage, variant }: SecurityMetricProps) {
    return (
        <div className="p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">{value}</span>
                <Badge variant={variant} className="text-xs">
                    {percentage}%
                </Badge>
            </div>
        </div>
    );
}

// Helper component for security definitions
interface DefinitionItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    variant: "destructive" | "default" | "outline" | "secondary";
}

function DefinitionItem({ icon, title, description, variant }: DefinitionItemProps) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5">
                <Badge variant={variant} className="p-1">
                    {icon}
                </Badge>
            </div>
            <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
            </div>
        </div>
    );
}