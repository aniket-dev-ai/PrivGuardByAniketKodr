import { JSX } from "react";

export default function Footer(): JSX.Element {
    return (
        <footer className="w-full p-4 text-center text-sm text-muted-foreground border-t border-border">
            © {new Date().getFullYear()} PrivGuard. All rights reserved.
        </footer>
    );
}
