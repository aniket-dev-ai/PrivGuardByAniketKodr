import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import PasswordCard from "@/components/password/PasswordCard";

interface PasswordDetail {
    id: string;
    service: string;
    domain: string;
    logo?: string;
    notes?: string;
    password: string;
}

export default function PasswordDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState<PasswordDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchPasswordDetail = async () => {
            try {
                const token = await getToken({ template: "new" });
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/${id}`, {
                    headers: { Authorization: token },
                });
                setEntry(res.data);
            } catch (err) {
                toast.error("Failed to load password detail");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPasswordDetail();
    }, [id, getToken]);

    const handleDelete = async (passwordId: string) => {
        try {
            const token = await getToken({ template: "new" });
            await axios.delete(`${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/${passwordId}`, {
                headers: { Authorization: token },
            });

            toast.success("Password deleted successfully");
            navigate("/vault"); // Redirect to vault list route
        } catch (err) {
            toast.error("Failed to delete password");
            console.error(err);
        }
    };

    const handleUpdateNotes = async (notes: string) => {
        try {
            const token = await getToken({ template: "new" });
            await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/${id}/update-note`,
                { notes },
                { headers: { Authorization: token } }
            );

            setEntry((prev) => (prev ? { ...prev, notes } : prev));
            toast.success("Notes updated successfully");
        } catch (err) {
            toast.error("Failed to update notes");
            console.error(err);
        }
    };

    const handleUpdatePassword = async (newPassword: string, strength: number) => {
        try {
            const token = await getToken({ template: "new" });
            await axios.post(
                `${import.meta.env.VITE_BACKEND_ADDR}/api/protected/vault/${id}/update-password`,
                {
                    password: newPassword,
                    strength
                },
                { headers: { Authorization: token } }
            );

            setEntry((prev) => (prev ? { ...prev, password: newPassword } : prev)); // Update local state with new password
            toast.success("Password updated successfully");
        } catch (err) {
            toast.error("Failed to update password");
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!entry) {
        return <div className="text-center pt-20 text-muted-foreground">Password not found.</div>;
    }

    return (
        <>
            <Navbar />
            <PasswordCard
                entry={entry}
                onDelete={handleDelete}
                onUpdateNotes={handleUpdateNotes}
                onUpdatePassword={handleUpdatePassword}
            />
        </>
    );
}
