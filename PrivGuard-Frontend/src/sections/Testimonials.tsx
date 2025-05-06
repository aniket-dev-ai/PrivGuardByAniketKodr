// src/sections/Testimonials.tsx

import { motion } from "framer-motion";
import { JSX } from "react";

const testimonials = [
    {
        name: "Jenna R.",
        role: "Privacy Activist",
        quote:
            "PrivGuard helped me realize how much data I was unintentionally leaking. It's a must-have for digital privacy."
    },
    {
        name: "Marcus T.",
        role: "Security Analyst",
        quote:
            "The fake identity generator is genius. I've started using it for all signups. This is digital hygiene done right."
    },
    {
        name: "Alina S.",
        role: "Tech Blogger",
        quote:
            "From UI to functionality, this is one of the best-designed privacy tools I've seen in a long time."
    }
];

export default function Testimonials(): JSX.Element {
    return (
        <section className="py-24 px-6 md:px-12 bg-background text-foreground">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Say</h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                    Real words from real humans who care about their privacy.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: i * 0.2, duration: 0.6 }}
                        className="bg-muted/40 p-6 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                        <p className="text-base md:text-lg italic mb-4">“{t.quote}”</p>
                        <div className="text-sm text-muted-foreground">
                            <strong>{t.name}</strong> — {t.role}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
