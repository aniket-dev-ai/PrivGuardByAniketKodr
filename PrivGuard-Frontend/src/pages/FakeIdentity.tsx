import { useEffect, useState } from "react";
import { useFakeUser } from "@/hooks/useFakeUser";
import FakeUserCard from "@/components/fakeIdentity/FakeUserCard";
import TempInboxViewer from "@/components/fakeIdentity/TempInboxViewer";
import Navbar from "@/components/Navbar";
import { createTempAccount } from "@/lib/tempMail";
import { toast } from "sonner";
import { User,         Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface FakeUser {
    name: string;
    email: string;
    username: string;
    password: string;
    avatar: string;
    bio: string;
}

export default function FakeIdentity() {
    const [user] = useState<FakeUser>(useFakeUser());
    const [tempEmail, setTempEmail] = useState<string>("");

    useEffect(() => {
        const setupEmail = async () => {
            try {
                const newEmail = await createTempAccount();
                setTempEmail(newEmail);
            } catch (err) {
                toast.error("Failed to create temporary email");
            }
        };

        setupEmail();
    }, []);
        
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container max-w-4xl mx-auto py-8 md:py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-6"
                >
                    <div className="p-3 bg-muted rounded-full mb-4">
                        <User className="text-primary h-6 w-6" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Digital Privacy Shield</h1>
                    <p className="text-muted-foreground text-center max-w-xl">
                        Generate a secure fake identity and use a temporary email to maintain your anonymity online
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card >
                        <CardContent>
                            <FakeUserCard user={{ ...user, email: tempEmail }} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                >
                    <Card>
                        <CardHeader >
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Temporary Email Inbox
                            </CardTitle>
                            <CardDescription>
                                Safely receive messages without exposing your personal email
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TempInboxViewer email={tempEmail} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="mt-12">
                        <h3 className="text-lg font-medium mb-4 text-center">Why Use a Fake Identity Online?</h3>
                        <Separator className="mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PrivacyFeature
                                title="Avoid Tracking"
                                description="Prevent companies from collecting and selling your personal data"
                            />
                            <PrivacyFeature
                                title="Prevent Spam"
                                description="Reduce unwanted emails and marketing messages to your primary inbox"
                            />
                            <PrivacyFeature
                                title="Online Safety"
                                description="Protect yourself from potential identity theft and online harassment"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

interface PrivacyFeatureProps {
    title: string;
    description: string;
}

const PrivacyFeature = ({ title, description }: PrivacyFeatureProps) => (
    <div className="p-4 border rounded-lg text-center">
        <h4 className="font-medium mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);