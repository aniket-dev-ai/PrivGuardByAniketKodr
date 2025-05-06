// src/sections/Hero.tsx

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection(): JSX.Element {
    const navigate = useNavigate();
    return (
        <section className="min-h-[90vh] flex items-center justify-center px-6 pt-24 md:pt-32 bg-background text-foreground">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl text-center space-y-10"
            >
                <motion.h1
                    className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Take Control of Your Digital Privacy
                </motion.h1>

                <motion.p
                    className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Monitor your shared data, generate fake identities, and stay secure online — all from one powerful dashboard.
                </motion.p>

                <motion.div
                    className="flex justify-center gap-4 flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <Button size="lg" onClick={()=> navigate("/dashboard")}>Get Started</Button>
                    <Button variant="outline" size="lg">
                        Learn More
                    </Button>
                </motion.div>

                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <img
                        src="/hero_vault.svg"
                        alt="Privacy Illustration"
                        className="mx-auto max-w-sm md:max-w-lg drop-shadow-xl"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
