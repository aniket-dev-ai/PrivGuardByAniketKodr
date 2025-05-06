// src/sections/HowItWorks.tsx

import { motion } from "framer-motion";
import { JSX } from "react";
import { Shield, Settings, BellRing } from "lucide-react";

const steps = [
    {
        title: "Connect Your Accounts",
        icon: Shield,
        description: "Securely link apps and services to analyze shared data."
    },
    {
        title: "Customize Privacy",
        icon: Settings,
        description: "Choose what to obscure, fake, or block — you're in charge."
    },
    {
        title: "Stay Informed",
        icon: BellRing,
        description: "Get real-time alerts and suggestions to stay secure."
    },
];

export default function HowItWorks(): JSX.Element {
    return (
        <section className="py-24 px-6 md:px-12 bg-background text-foreground">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                    Simple, secure, and smart. Here's how you take back control:
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <div className="bg-muted p-4 rounded-full">
                                <Icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                {step.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}