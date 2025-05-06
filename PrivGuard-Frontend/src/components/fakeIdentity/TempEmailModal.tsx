// components/TempEmailModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TempEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    messageId: string | null;
}

export default function TempEmailModal({ open, onOpenChange, messageId }: TempEmailModalProps) {
    const [message, setMessage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!messageId) return;

        const fetchMessage = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.mail.tm/messages/${messageId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("tempAuthToken")}`
                        }
                    },
                );
                const data = await res.json();
                setMessage(data);
            } catch (err) {
                console.error("Failed to fetch message:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessage();
    }, [messageId]);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Email Details</DialogTitle>
                    </DialogHeader>
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : message ? (
                        <div className="space-y-2 text-sm">
                            <p><span className="font-medium">From:</span> {message.from.address}</p>
                            <p><span className="font-medium">Subject:</span> {message.subject}</p>
                            {message.html?.length > 0 && (
                                <div
                                    className="mt-4 border-t pt-2 text-sm text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: message.html[0] }}
                                />
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">Could not load message.</p>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
