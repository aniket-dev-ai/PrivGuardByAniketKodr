import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import PasswordSection from "./PasswordSection";
import NotesSection from "./NotesSection";

interface PasswordCardProps {
    entry: {
        id: string;
        service: string;
        domain: string;
        logo?: string;
        notes?: string;
        password: string;
    };
    onDelete: (id: string) => void;
    onUpdateNotes: ( notes: string) => Promise<void>;
    onUpdatePassword: (newPassword: string, strength: number) => Promise<void>; 
}

export default function PasswordCard({
    entry,
    onDelete,
    onUpdateNotes,
    onUpdatePassword,
}: PasswordCardProps) {
    return (
        <div className="flex justify-center pt-10 px-4">
            <Card className="w-full max-w-md shadow-xl relative border rounded-2xl">
                {/* Delete Button */}
                <div className="absolute top-4 right-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                <Trash className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this password?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This entry for <strong>{entry.service}</strong> will be removed permanently.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(entry.id)} className="bg-destructive text-white">
                                    Yes, delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Card Header */}
                <CardHeader className="flex flex-col items-center text-center space-y-2">
                    <Avatar className="w-16 h-16 shadow">
                        <AvatarImage
                            src={entry.logo || `https://logo.clearbit.com/${entry.domain}`}
                            alt={entry.service}
                            className="bg-white object-contain"
                        />
                        <AvatarFallback>{entry.service[0]}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl font-semibold">{entry.service}</CardTitle>
                    <p className="text-sm text-muted-foreground">{entry.domain}</p>
                </CardHeader>

                {/* Card Body */}
                <CardContent className="space-y-6 px-6 pb-6">
                    <NotesSection
                        notes={entry.notes}
                        passwordId={entry.id}
                        onUpdateNotes={onUpdateNotes}
                    />
                    <PasswordSection
                        password={entry.password}
                        passwordId={entry.id}
                        onUpdatePassword={onUpdatePassword}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
