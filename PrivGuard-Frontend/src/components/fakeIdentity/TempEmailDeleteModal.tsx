// components/TempEmailDeleteModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TempEmailModalDeleteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    messageId: string | null;
    onDeleteSuccess: () => void;
}

export default function TempEmailModalDelete({
    open,
    onOpenChange,
    messageId,
    onDeleteSuccess
}: TempEmailModalDeleteProps) {
    const [deleting, setDeleting] = useState(false);


    const handleDelete = async () => {
        if (!messageId) return;

        setDeleting(true);
        try {
            const res = await fetch(`https://api.mail.tm/messages/${messageId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("tempAuthToken")}`,
                },
            });

            if (res.ok) {
                onDeleteSuccess();
                onOpenChange(false);
            } else {
                console.error("Failed to delete email");
            }
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Email</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this email? This action cannot be undone.
                </p>
                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
