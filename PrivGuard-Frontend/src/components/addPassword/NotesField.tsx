// src/components/addPassword/NotesField.tsx
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
    notes: string;
    setNotes: (val: string) => void;
}

export default function NotesField({ notes, setNotes }: Props) {
    return (
        <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any extra details here..."
            />
        </div>
    );
}
