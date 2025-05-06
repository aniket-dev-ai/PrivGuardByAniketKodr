// src/sections/WhyPrivGuard.tsx

import { motion } from "framer-motion";
import { JSX } from "react";

export default function WhyPrivGuard(): JSX.Element {
    return (
        <section className="py-24 px-6 md:px-12 bg-background text-foreground">
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center space-y-6"
            >
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Why Choose PrivGuard?
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                    Every tap, every click, every signup — your data is leaving a trail. PrivGuard empowers you to take it back.
                    With real-time tracking, breach alerts, and tools to obscure your identity, you're in full control.
                </p>
            </motion.div>
        </section>
    );
}
