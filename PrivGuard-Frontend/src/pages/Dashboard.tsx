import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { navLinks } from "@/config/navigation";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted">
            <Navbar />
            <main className="flex flex-1 items-center justify-center px-6 py-12">
                <motion.div
                    className="grid gap-10 text-center max-w-5xl w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Welcome to PrivGuard</h1>
                        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                            One place to manage your passwords, identity and privacy security tools.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
                        {navLinks.map(({ name, path, icon: Icon }) => (
                            <Link to={path} key={name} className="group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="h-full rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 shadow-lg flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:shadow-xl relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <div className="p-4 rounded-full bg-primary/10 text-primary relative z-10 group-hover:bg-primary/20 transition-colors duration-300">
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>

                                    <div className="text-lg font-semibold group-hover:text-primary transition-colors duration-200 text-center">
                                        {name}
                                    </div>

                                    <p className="text-sm text-muted-foreground text-center max-w-xs">
                                        {getFeatureDescription(name)}
                                    </p>

                                    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-transparent group-hover:via-primary/30 group-hover:to-transparent transition-all duration-300"></div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

// Helper function to get descriptions for each feature
function getFeatureDescription(name: string): string {
    switch (name) {
        case "Vault":
            return "Securely store all your passwords and credentials";
        case "Add Website":
            return "Save new website login details to your vault";
        case "Check Breaches":
            return "Verify if your accounts have been compromised";
        case "Fake Identity":
            return "Generate temporary identities for privacy protection";
        case "Password Check":
            return "Test password strength and security";
        default:
            return "Protect your online privacy";
    }
}