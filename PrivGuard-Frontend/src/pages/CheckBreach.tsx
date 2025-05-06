import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { AlertTriangle, Shield, Search, MailCheck, Info, Lock, ExternalLink } from "lucide-react";
import EmailSearchForm from "@/components/breach-checker/EmailSearchForm";
import BreachSummary from "@/components/breach-checker/BreachSummary";
import BreachDetailsTabs from "@/components/breach-checker/BreachDetailsTabs";
import NoBreachesFound from "@/components/breach-checker/NoBreachesFound";
import { BreachResponse } from "@/types/breach-types";
import { motion } from "framer-motion";

/**
 * Email Breach Checker Component
 * Enterprise-level UI for checking email breach data
 */
export default function CheckBreaches() {
    // State management
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [breachData, setBreachData] = useState<BreachResponse | null>(null);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    /**
     * Handles the breach check API request
     */
    const handleCheck = async () => {
        if (!email) return;

        // Reset states before new search
        setHasSearched(true);
        setLoading(true);
        setBreachData(null);
        setError("");

        try {
            const response = await axios.get(`https://api.xposedornot.com/v1/breach-analytics?email=${email}`);

            if (response.data.Error === "Not found") {
                setBreachData(null);
            } else {
                console.log(response.data)
                setBreachData(response.data);
            }
        } catch (error) {
            setError("Failed to check breaches. Please verify the email address and try again.");
            console.error("Breach check error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-semibold">Security Breach Scanner</CardTitle>
                                        <CardDescription className="mt-1">
                                            Check if your email has been exposed in data breaches
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="hidden md:block text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        <span>Your searches are encrypted and private</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-0 pb-6">
                            <EmailSearchForm
                                email={email}
                                setEmail={setEmail}
                                onSubmit={handleCheck}
                                loading={loading}
                            />
                            <div className="md:hidden text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-3 w-3" />
                                    <span>Your searches are encrypted and private</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Error display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border border-destructive/30 bg-destructive/10">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span>{error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Results display */}
                {!loading && hasSearched && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                {breachData && breachData.ExposedBreaches?.breaches_details?.length > 0 ? (
                                    <div className="space-y-8">
                                        <BreachSummary data={breachData} />
                                        <BreachDetailsTabs data={breachData} />
                                    </div>
                                ) : (
                                    <NoBreachesFound email={email} />
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Info section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-12"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                <span>Understanding Data Breaches</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <InfoCard
                                    icon={<Search className="h-5 w-5 text-primary" />}
                                    title="What We Check"
                                    description="We use XposedOrNot API to access information from thousands of confirmed data breaches across the internet."
                                />
                                <InfoCard
                                    icon={<MailCheck className="h-5 w-5 text-primary" />}
                                    title="Email Protection"
                                    description="Your email is securely transmitted and never stored in our systems after your search is complete."
                                />
                                <InfoCard
                                    icon={<Shield className="h-5 w-5 text-primary" />}
                                    title="Stay Protected"
                                    description="If your details are found in a breach, we recommend changing passwords and enabling 2FA where possible."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-center border-t px-6 py-4">
                            <div className="mb-6 flex flex-col items-center">
                                <p className="text-lg font-medium text-primary italic mb-4 text-center">
                                    "Empowering digital safety through breach transparency"
                                </p>

                                <a
                                    href="https://xposedornot.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors duration-300"
                                >
                                    Visit XposedOrNot
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                                Data sourced from XposedOrNot community edition.
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div >
    );
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const InfoCard = ({ icon, title, description }: InfoCardProps) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="mb-3">{icon}</div>
        <h3 className="font-medium text-base mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);