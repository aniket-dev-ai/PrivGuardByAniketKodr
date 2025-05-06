import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { startRegistration } from "@simplewebauthn/browser";

// This will be replaced with your API data
interface Passkey {
    id: string;
    name: string;
    createdAt: string;
    device: string;
}

const PasskeyManagementTab = () => {
    const { getToken } = useAuth();
    const [passkeys, setPasskeys] = useState<Passkey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPasskeys = async () => {
        setIsLoading(true);
        try {
            const token = await getToken({ template: "new" });
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ADDR}/api/auth/passkeys`, {
                headers: { Authorization: token },
                withCredentials: true,
            });
            setPasskeys(res.data || []);
        } catch (err: any) {
            toast.error("Failed to load passkeys");
            setPasskeys([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPasskeys();
    }, []);

    const handleAddPasskey = async (name: string) => {
        try {
            const token = await getToken({ template: "new" });

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/register/start`,
                {},
                {
                    headers: { Authorization: token },
                    withCredentials: true,
                }
            );

            const attResp = await startRegistration(res.data.publicKey.publicKey);

            await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/auth/register/finish`,
                {
                    ...attResp,
                    name
                },
                {
                    headers: { Authorization: token },
                    withCredentials: true,
                }
            );

            toast.success("Passkey registered successfully!");
            fetchPasskeys();
        } catch (err: any) {
            const msg = err?.response?.data?.error || err.message || "Registration failed";
            toast.error(msg);
        }
    };

    const handleRemovePasskey = async (id: string) => {
        try {
            const token = await getToken({ template: "new" });
            await axios.delete(`${import.meta.env.VITE_BACKEND_ADDR}/api/auth/passkeys/${id}`, {
                headers: { Authorization: token },
                withCredentials: true,
            });
            setPasskeys(passkeys.filter(pk => pk.id !== id));
            toast.success("Passkey removed");
        } catch (err: any) {
            toast.error("Failed to remove passkey");
        }
    };

    // Create a motion component from Card
    const MotionCard = motion.create(Card);

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border-muted/30 backdrop-blur-sm bg-card/90"
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base font-medium">Passkey Management</CardTitle>
                    </div>
                    <AddPasskeyDialog
                        onAddPasskey={handleAddPasskey}
                        disabled={passkeys.length >= 2}
                    />
                </div>
                <CardDescription className="text-xs">Manage your passkeys for passwordless authentication</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <div className="animate-pulse flex space-x-2">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                        </div>
                    </div>
                ) : passkeys.length > 0 ? (
                    <div className="space-y-3">
                        {passkeys.map((passkey) => (
                            <PasskeyItem
                                key={passkey.id}
                                passkey={passkey}
                                onRemove={() => handleRemovePasskey(passkey.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyPasskeyState />
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-xs text-muted-foreground w-full px-1">
                    <div className="font-medium mb-1">About Passkeys</div>
                    <p>Passkeys use your device's biometric authentication or PIN to provide secure access without passwords.</p>
                </div>
            </CardFooter>
        </MotionCard>
    );
};

// Helper components for PasskeyManagementTab
const AddPasskeyDialog = ({
    onAddPasskey,
    disabled
}: {
    onAddPasskey: (name: string) => void;
    disabled?: boolean;
}) => {
    const [passKeyName, setPassKeyName] = useState("");
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        if (passKeyName.trim()) {
            onAddPasskey(passKeyName);
            setPassKeyName("");
            setOpen(false);
        }
    };

    if (disabled) {
        return (
            <Button disabled size="sm" className="h-7 text-xs opacity-50 cursor-not-allowed" title="Limit reached">
                <Plus className="mr-1 h-3 w-3" />
                Max 2 Passkeys
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 text-xs">
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add a New Passkey</DialogTitle>
                    <DialogDescription className="text-xs">
                        Register a new device for passwordless authentication.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3 py-3">
                    <div className="space-y-1">
                        <label htmlFor="passkey-name" className="text-xs font-medium">
                            Passkey Name
                        </label>
                        <Input
                            id="passkey-name"
                            value={passKeyName}
                            onChange={(e) => setPassKeyName(e.target.value)}
                            placeholder="e.g., Work Laptop"
                            className="w-full text-sm h-8"
                        />
                    </div>
                    <Alert className="bg-amber-500/10 text-amber-600 border-amber-200 py-2">
                        <AlertDescription className="text-xs">
                            You'll be prompted to use your device's authentication.
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button size="sm" className="text-xs" onClick={handleSubmit}>
                        <KeyRound className="mr-1 h-3 w-3" />
                        Register
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const PasskeyItem = ({ passkey, onRemove }: { passkey: Passkey, onRemove: () => void }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    
    return (
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                    <KeyRound size={12} className="text-primary" />
                </div>
                <div>
                    <div className="text-sm font-medium">{passkey.name}</div>
                    <div className="text-xs text-muted-foreground">
                        Created At: {new Date(passkey.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Trash2 size={14} className="text-red-500" />
                        <span className="sr-only">Remove</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Passkey?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                            Are you sure you want to delete <strong>{passkey.name}</strong>? You won't be able to use it to sign in anymore.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs" onClick={() => setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => {
                                onRemove();
                                setIsConfirmOpen(false);
                            }} 
                            className="bg-red-600 hover:bg-red-700 text-xs"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const EmptyPasskeyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
            <KeyRound className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium mb-1">No passkeys registered</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
                Add your first passkey to enable passwordless sign-in to your account.
            </p>
        </div>
    );
};

export default PasskeyManagementTab;