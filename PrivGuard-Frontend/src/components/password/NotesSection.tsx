import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
    notes?: string;
    passwordId: string;
    onUpdateNotes: (notes: string) => Promise<void>;
}

export default function NotesSection({ notes = "", onUpdateNotes }: Props) {
    const [editing, setEditing] = useState(false);
    const [currentNotes, setCurrentNotes] = useState(notes);
    const [originalNotes, setoriginalNotes] = useState(notes);

    const handleSave = async () => {
        if (currentNotes != originalNotes) {
            try {
                await onUpdateNotes(currentNotes);
                setoriginalNotes(currentNotes)
                setEditing(false);
            } catch (err) {
                toast.error("Failed to update notes");
            }
        } else {
            setEditing(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-medium">Notes</Label>
                {editing ? (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSave}
                        className="text-muted-foreground hover:text-primary"
                    >
                        <Check size={18} />
                    </Button>
                ) : (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setEditing(true), toast.info("You may now update your notes.") }}
                        className="text-muted-foreground hover:text-primary"
                    >
                        <Pencil size={18} />
                    </Button>
                )}
            </div>

            {editing ? (
                <Textarea
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    className="resize-none"
                    placeholder="Add notes here..."
                    rows={4}
                />
            ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentNotes || "No notes available"}
                </p>
            )}
        </div>
    );
}
