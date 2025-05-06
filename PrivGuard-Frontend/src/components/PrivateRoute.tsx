import { JSX } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default PrivateRoute;
