// SecurityDashboard.tsx - Main container component
import Navbar from "@/components/Navbar";
import SecurityHeader from "@/components/security-dashboard/SecurityHeader";
import SecurityTabs from "@/components/security-dashboard/SecurityTabs";

const SecurityDashboard = () => {


    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <Navbar />
            <div className="max-w-3xl mx-auto pt-10 pb-20 px-4">
                <SecurityHeader />
                <SecurityTabs />
            </div>
        </div>
    );
};

export default SecurityDashboard;