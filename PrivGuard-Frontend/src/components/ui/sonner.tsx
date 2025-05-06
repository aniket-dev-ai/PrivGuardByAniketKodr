// src/components/sonner.tsx

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      richColors
      visibleToasts={4}
      duration={4000}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "bg-popover text-popover-foreground border border-border shadow-lg rounded-lg animate-in fade-in slide-in-from-top-1 duration-300",
          title: "font-semibold text-foreground",
          description: "text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90 transition rounded-md",
          cancelButton:
            "bg-muted text-muted-foreground hover:bg-muted/70 transition rounded-md",
          success: "bg-green-600 text-white",
          error: "bg-red-600 text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
