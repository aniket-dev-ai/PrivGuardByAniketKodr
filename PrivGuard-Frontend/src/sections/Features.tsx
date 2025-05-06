// src/sections/Features.tsx

import { ShieldCheck, VenetianMask, AlertCircle, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        title: "Data Vault",
        icon: ShieldCheck,
        description: "Securely store and review what data you've shared with apps and websites."
    },
    {
        title: "Fake Identity Generator",
        icon: VenetianMask,
        description: "Protect your real identity with generated personas for safer browsing."
    },
    {
        title: "Breach Alerts",
        icon: AlertCircle,
        description: "Get notified instantly if your data is found in a known data breach."
    },
    {
        title: "Privacy Tips",
        icon: Brain,
        description: "Learn simple ways to protect your privacy and digital footprint every day."
    },
];

export default function Features(): JSX.Element {
    return (
        <section className="py-24 px-6 md:px-12 bg-background text-foreground">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">What You Can Do</h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                    Explore the tools that put privacy back in your hands.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="flex items-center gap-4">
                                    <div className="bg-muted p-3 rounded-xl">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}