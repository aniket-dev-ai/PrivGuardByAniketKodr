import { CopyableField } from "@/components/fakeIdentity/CopyableField";

export default function FakeUserCard({ user }: { user: any }) {
    return (
        <div className="w-full max-w-sm mx-auto rounded-xl bg-card p-6 shadow-md space-y-4">
            <div className="flex flex-col items-center">
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-16 h-16 rounded-full mb-2"
                />
                <h3 className="text-lg font-bold text-center">{user.name}</h3>
                <p className="text-muted-foreground text-sm text-center">{user.bio}</p>
            </div>

            <div className="space-y-2">
                <CopyableField label="Username" value={user.username} />
                <CopyableField label="Email" value={user.email} />
                <CopyableField label="Password" value={user.password} />
            </div>
        </div>
    );
}
