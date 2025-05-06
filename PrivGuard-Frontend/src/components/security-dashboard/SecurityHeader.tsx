import { motion } from "framer-motion";
import { Lock } from "lucide-react";



const SecurityHeader = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center mb-8"
        >
            <div className="relative mb-3">
                <div className="mb-4 p-3 bg-muted rounded-full">
                    <Lock className="h-6 w-6 text-primary" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-center tracking-tight">
                Security Center
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                Strengthen your account security with advanced multi-factor authentication options
            </p>
        </motion.div>
    );
};

export default SecurityHeader;