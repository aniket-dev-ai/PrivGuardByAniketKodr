import PrivateRoute from "@/components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PasswordVault from "@/pages/PasswordVault";
import AddPassword from "@/pages/AddPassword";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/sections/HomePage";
import FakeIdentity from "@/pages/FakeIdentity";
import CheckPassword from "@/pages/CheckPassword";
import CheckBreaches from "@/pages/CheckBreach";
import { withPasskeyAuth } from "@/components/PasskeyHOC";
import PasswordDetailPage from "@/pages/PasswordDetail";
import TOTPGuard from "@/components/TOTPGuard";
import SecurityDashboard from "@/pages/SecurtityDashboard";
import TOTPSetup from "@/pages/TOTPSetup";




const AppRouter = () => {

    const WithPasskeyPasswordDetails = withPasskeyAuth(PasswordDetailPage);



    const ProtectedSecurityCenter = (() => (
        <TOTPGuard>
            <SecurityDashboard/>
        </TOTPGuard>
    ));




    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vault" element={<PrivateRoute><PasswordVault /></PrivateRoute>} />
                <Route path="/add-website" element={<PrivateRoute><AddPassword /></PrivateRoute>} />
                <Route path="/password/:id" element={<WithPasskeyPasswordDetails />} /> {/* Passkey Protected */}
                <Route path="/identity" element={<FakeIdentity />} />
                <Route path="/checkpassword" element={<CheckPassword />} />
                <Route path="/check-breaches" element={<CheckBreaches />} />
                <Route path="/security" element={<PrivateRoute><ProtectedSecurityCenter /></PrivateRoute>} />
                <Route path="/totp-setup" element={<TOTPSetup/>}/>
            </Routes>
        </Router>
    );
};

export default AppRouter;
