// src/components/MobileNavbar.tsx

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { navLinks } from "@/config/navigation";

export default function MobileNavbar() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-background text-foreground p-6">
                    <nav className="space-y-4">
                        {navLinks.map(({ name, path, icon: Icon }) => (
                            <Link to={path} key={name} className="flex items-center gap-2 text-lg font-semibold hover:underline">
                                <Icon size={18} />
                                {name}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
