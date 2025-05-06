// src/sections/Newsletter.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { JSX, useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function Newsletter(): JSX.Element {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setTimeout(() => setEmail(""), 1000);
        }
    };

    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-muted text-foreground relative">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl mx-auto text-center space-y-6"
            >
                <h2 className="text-3xl md:text-4xl font-bold">
                    Join the Privacy Revolution
                </h2>
                <p className="text-muted-foreground">
                    Get the latest tools, tips, and security alerts straight to your inbox.
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full max-w-md"
                    />
                    <Button type="submit" size="lg">
                        {submitted ? "✓ Subscribed" : "Subscribe"}
                    </Button>
                </form>
            </motion.div>

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-6 p-3 bg-primary text-background rounded-full shadow-lg hover:scale-105 transition"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </section>
    );
}
