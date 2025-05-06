import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { ClerkProvider } from '@clerk/clerk-react'
import { TOTPProvider } from "./context/TOTPContext.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" >
        <TOTPProvider>
          <App />
        </TOTPProvider>
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);
