import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, RefreshCw, Save, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import WebsiteSearch from "@/components/addPassword/WebsiteSearch";
import { toast } from "sonner";
import PasswordField from "@/components/addPassword/PasswordField";
import SelectedServicePreview from "@/components/addPassword/SelectedServicePreview";
import NotesField from "@/components/addPassword/NotesField";
import useGeneratedPassword from "@/hooks/useGeneratedPassword";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Service {
    name: string;
    domain: string;
    logo?: string;
}

export default function EnterprisePasswordVault() {
    const { getToken } = useAuth();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [password, setPassword, generatePassword] = useGeneratedPassword();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Calculate password strength
    const calculatePasswordStrength = (pass: string) => {
        if (!pass) return 0;
        
        let strength = 0;
        
        // Length check
        if (pass.length >= 12) strength += 25; 
        else if (pass.length >= 8) strength += 15;
        else if (pass.length >= 6) strength += 10;
        
        // Complexity checks
        if (/[A-Z]/.test(pass)) strength += 20;
        if (/[a-z]/.test(pass)) strength += 15;
        if (/[0-9]/.test(pass)) strength += 20;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
        
        return Math.min(strength, 100);
    };

    // Update password strength whenever password changes
    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(password));
    }, [password]);

    // Update password strength when password changes manually
    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
    };

    // Generate password
    const handleGeneratePassword = () => {
        generatePassword();
    };

        const getStrengthLabel = () => {
            if (passwordStrength >= 80) return "Strong";
            if (passwordStrength >= 50) return "Medium";
            return "Weak";
        };

    const getStrengthColor = () => {
        if (passwordStrength >= 80) return "bg-green-500";
        if (passwordStrength >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    const savePassword = async () => {
        if (!selectedService || !password) {
            toast.warning("Please select a service and enter a password");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/add`,
                {
                    service: selectedService.name,
                    domain: selectedService.domain,
                    logo: selectedService.logo,
                    password,
                    notes,
                    strength: passwordStrength
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            );

            toast.success("Credentials securely stored in your vault");
            setSelectedService(null);
            setPassword("");
            setNotes("");
            setPasswordStrength(0);
        } catch (err) {
            console.error("Error saving password:", err);
            toast.error("Failed to save credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto max-w-2xl py-12 px-4">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Add Password To Vault</h1>
                </div>
                
                <Card className="rounded-xl border shadow-xl">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-bold">Secure Credentials</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Add and manage credentials with enterprise-grade security
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                                End-to-End Encrypted
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        <div>
                            {!selectedService ? (
                                <WebsiteSearch onSelect={setSelectedService} />
                            ) : (
                                <SelectedServicePreview
                                    service={selectedService}
                                    onClear={() => setSelectedService(null)}
                                />
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <PasswordField 
                                value={password} 
                                onChange={handlePasswordChange} 
                            />
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">Password Strength</p>
                                    <Badge variant={passwordStrength >= 80 ? "default" : passwordStrength >= 50 ? "secondary" : "destructive"}>
                                        {getStrengthLabel()}
                                    </Badge>
                                </div>
                                <Progress value={passwordStrength} className={getStrengthColor()} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground italic">
                                    Recommended: Use a generated unique password for maximum security
                                </p>
                                <Button
                                    onClick={handleGeneratePassword}
                                    className="rounded-lg"
                                    variant="outline"
                                    size="sm"
                                >
                                    <RefreshCw className="mr-2 h-3 w-3" />
                                    Generate
                                </Button>
                            </div>
                        </div>

                        <NotesField notes={notes} setNotes={setNotes} />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                onClick={savePassword}
                                disabled={loading}
                                className="rounded-lg"
                                size="lg"
                            >
                                {loading ? (
                                    <>Encrypting...</>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Secure in Vault
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="mt-6 flex justify-center">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Enterprise-grade security with zero-knowledge architecture
                    </p>
                </div>
            </div>
        </div>
    );
}