import {
    Home,
    Vault,
    PlusCircle,
    ShieldAlert,
    UserSquare2,
    ShieldCheck,
    Lock
} from "lucide-react";

export const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Vault", path: "/vault", icon: Vault },
    { name: "Add Website", path: "/add-website", icon: PlusCircle },
    { name: "Check Breaches", path: "/check-breaches", icon: ShieldAlert },
    { name: "Fake Identity", path: "/identity", icon: UserSquare2 },
    { name: "Password Check", path: "/checkpassword", icon: ShieldCheck },
    { name: "Security Center", path: "/security", icon: Lock },
];
