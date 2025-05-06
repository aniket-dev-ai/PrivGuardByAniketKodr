import { ReactNode } from "react";
import PasswordBreachCheck from "@/components/CheckPassword/PasswordBreachCheck";
import Navbar from "@/components/Navbar";
import { Shield, ShieldCheck, ShieldAlert, Info } from "lucide-react";
import { Card, CardContent} from "@/components/ui/card";
import { motion } from "framer-motion";

interface TrustFeatureProps {
    icon: ReactNode;
    title: string;
    description: string;
}

interface ProcessStepProps {
    number: string;
    title: string;
    description: string;
}

const CheckPassword = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <div className="relative">
                <div className="flex flex-col items-center max-w-6xl mx-auto px-4 py-12 md:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center mb-8"
                    >
                        <div className="mb-6 p-3 bg-muted rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                            Secure Password Check
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Check if your password has been exposed in data breaches without compromising your security
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-xl"
                    >
                        <Card>
                            <CardContent className="p-6">
                                <PasswordBreachCheck />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
                    >
                        <TrustFeature
                            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                            title="Zero Storage"
                            description="Your password is never stored or transmitted in plain text"
                        />
                        <TrustFeature
                            icon={<ShieldAlert className="h-6 w-6 text-primary" />}
                            title="k-Anonymity"
                            description="Only a partial hash of your password is sent to our servers"
                        />
                        <TrustFeature
                            icon={<Info className="h-6 w-6 text-primary" />}
                            title="Industry Standard"
                            description="Uses the same secure methodology as Google and Mozilla"
                        />
                    </motion.div>
                </div>
            </div>

            {/* How it works section */}
            <div className="bg-muted/50 py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid gap-8 md:grid-cols-3">
                        <ProcessStep
                            number="01"
                            title="Enter Password"
                            description="Enter your password in our secure form. It never leaves your browser in plaintext."
                        />
                        <ProcessStep
                            number="02"
                            title="Secure Hash Check"
                            description="We only send the first 5 characters of your password's SHA-1 hash for verification."
                        />
                        <ProcessStep
                            number="03"
                            title="Instant Results"
                            description="See if your password has appeared in any known data breaches and get recommendations."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Trust feature component
const TrustFeature = ({ icon, title, description }: TrustFeatureProps) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="mb-3">{icon}</div>
        <h3 className="font-medium text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

// Process step component
const ProcessStep = ({ number, title, description }: ProcessStepProps) => (
    <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-primary font-bold">
            {number}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default CheckPassword;