// TempInboxViewer.tsx
import { useEffect, useState } from "react";
import { fetchTempEmails } from "@/lib/tempMail";
import TempEmailModal from "./TempEmailModal";
import { Trash } from "lucide-react";
import TempEmailModalDelete from "./TempEmailDeleteModal";

interface TempInboxViewerProps {
    email: string;
}

interface Message {
    id: string;
    from: {
        address: string;
        name?: string;
    };
    subject: string;
    intro: string;
    createdAt: string;
}

export default function TempInboxViewer({ email }: TempInboxViewerProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevents opening the view modal
        setMessageToDelete(id);
        setOpenDeleteModal(true);
    };

    const handleDeleteSuccess = () => {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageToDelete));
        setMessageToDelete(null);
    };

    useEffect(() => {
        const pollInbox = async () => {
            try {
                const inboxRes = await fetchTempEmails();

                const transformed = inboxRes.map((msg: any) => ({
                    id: msg.id,
                    from: msg.from,
                    subject: msg.subject,
                    intro: msg.intro,
                    createdAt: msg.createdAt,
                }));

                setMessages(transformed);
            } catch (err) {
                console.error("Failed to fetch inbox", err);
            } finally {
                setLoading(false);
            }
        };

        pollInbox();
        const interval = setInterval(pollInbox, 5000);
        return () => clearInterval(interval);
    }, [email]);

    const openMessage = (id: string) => {
        setSelectedMessageId(id);
        setOpenModal(true);
    };

    return (
        <div className="bg-muted p-4 rounded-xl w-full">
            <h4 className="text-sm font-semibold mb-2">Inbox ({email})</h4>
            {loading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
            ) : messages.length === 0 ? (
                <p className="text-xs text-muted-foreground">No emails yet...</p>
            ) : (
                <ul className="space-y-2 text-sm">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            onClick={() => openMessage(msg.id)}
                            className="bg-background p-3 rounded shadow cursor-pointer hover:shadow-lg transition-all"
                        >
                            <div className="flex justify-between">

                                <div>

                                    <p className="font-medium">{msg.subject}</p>
                                    <p className="text-xs text-muted-foreground">From: {msg.from?.address}</p>
                                    <p className="text-sm mt-1">{msg.intro}</p>
                                </div>
                                <Trash
                                    className="h-4 w-4 hover:scale-105"
                                    onClick={(e) => handleDeleteClick(e, msg.id)}
                                />
                            </div>

                        </li>
                    ))}
                </ul>
            )}

            {/* Modal for selected email */}
            <TempEmailModal
                open={openModal}
                onOpenChange={setOpenModal}
                messageId={selectedMessageId}
            />
            <TempEmailModalDelete
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                messageId={messageToDelete}
                onDeleteSuccess={handleDeleteSuccess}
            />

        </div>
    );
}
