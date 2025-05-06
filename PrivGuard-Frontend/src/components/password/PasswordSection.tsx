import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Pencil, Check, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import useGeneratedPassword from "@/hooks/useGeneratedPassword";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Progress
} from "@/components/ui/progress";

interface Props {
    password: string;
    passwordId: string;
    onUpdatePassword: (newPassword: string, strength: number) => Promise<void>;
}

export default function PasswordSection({ password,  onUpdatePassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState(password);
    const [originalPassword, setOriginalPassword] = useState(password);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const [, , generatePassword] = useGeneratedPassword();

    // Calculate password strength whenever password changes
    useEffect(() => {
        calculatePasswordStrength(currentPassword);
    }, [currentPassword]);

    const calculatePasswordStrength = (pass: string) => {
        // Basic password strength algorithm
        let strength = 0;
        
        if (pass.length >= 8) strength += 20;
        if (pass.length >= 12) strength += 10;
        if (/[A-Z]/.test(pass)) strength += 20;
        if (/[a-z]/.test(pass)) strength += 15;
        if (/[0-9]/.test(pass)) strength += 15;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
        
        setPasswordStrength(Math.min(strength, 100));
    };

    const getStrengthLabel = () => {
        if (passwordStrength < 40) return { text: "Weak", color: "text-red-500" };
        if (passwordStrength < 70) return { text: "Moderate", color: "text-amber-500" };
        return { text: "Strong", color: "text-green-500" };
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(currentPassword);
        setIsCopied(true);
        toast.success("Password copied to clipboard");
        
        // Reset copied icon after 2 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setCurrentPassword(newPassword);
        toast.success("New secure password generated", {
            description: "Your password has been updated with a strong alternative."
        });
        setEditing(true);
    };

    const handleSave = async () => {
        if (currentPassword !== originalPassword) {
            if (passwordStrength < 40) {
                toast.warning("This password is weak. Consider generating a stronger one.");
            }
            setShowConfirm(true);
        } else {
            setEditing(false);
        }
    };

    const confirmSave = async () => {
        try {
            await onUpdatePassword(currentPassword, passwordStrength);
            setOriginalPassword(currentPassword);
            toast.success("Password updated successfully");
        } catch (error) {
            toast.error("Failed to update password", {
                description: "Please try again or contact support."
            });
        } finally {
            setEditing(false);
            setShowConfirm(false);
        }
    };

    const strengthLabel = getStrengthLabel();

    return (
        <div className="rounded-lg bg-card p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold">Password</Label>
                    {!editing && 
                        <div className="text-xs text-muted-foreground">
                            {showPassword ? "(visible)" : "(hidden)"}
                        </div>
                    }
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {editing ? (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleSave}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Check size={18} />
                                </Button>
                            ) : (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditing(true);
                                        toast.info("Password edit mode activated");
                                    }}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Pencil size={18} />
                                </Button>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                            {editing ? "Save changes" : "Edit password"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            readOnly={!editing}
                            className={`pr-20 transition-all duration-200 ${editing ? "border-primary bg-background" : "bg-muted"}`}
                            placeholder={editing ? "Enter new password" : "••••••••"}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopy}>
                                            {isCopied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isCopied ? "Copied!" : "Copy password"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowPassword((prev) => !prev)}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {showPassword ? "Hide password" : "Show password"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
                
                {editing && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Password strength</span>
                                <span className={`text-xs font-medium ${strengthLabel.color}`}>{strengthLabel.text}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={passwordStrength} className="h-1.5" />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                {passwordStrength < 70 && (
                                    <>
                                        <AlertCircle size={12} />
                                        <span>Consider using a stronger password</span>
                                    </>
                                )}
                            </div>
                            <Button
                                onClick={handleGeneratePassword}
                                className="rounded-full"
                                variant="outline"
                                size="sm"
                            >
                                <RefreshCw className="mr-2 h-3 w-3" />
                                Generate Strong Password
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogTrigger asChild />
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Password Update</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to update your password? This action cannot be undone and will replace your existing password.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSave} className="bg-primary">Update Password</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}