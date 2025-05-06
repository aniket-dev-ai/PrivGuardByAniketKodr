// src/pages/HomePage.tsx

import { JSX } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/Hero";
import WhyPrivGuard from "@/sections/WhyPrivGuard";
import Features from "@/sections/Features";
import HowItWorks from "@/sections/HowItWorks";
import Testimonials from "@/sections/Testimonials";
import Newsletter from "@/sections/Newsletter";

export default function HomePage(): JSX.Element {
    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <WhyPrivGuard />
                <Features />
                <HowItWorks />
                <Testimonials />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
}
