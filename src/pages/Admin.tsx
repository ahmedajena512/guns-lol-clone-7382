import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLink, FaPalette, FaMusic, FaSignOutAlt, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getProfile, updateProfile, uploadFile, UserProfile, DEFAULT_PROFILE } from "../lib/services";

export function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleUpdate = async (updates: Partial<UserProfile>) => {
        try {
            await updateProfile(updates);
            setProfile(prev => ({ ...prev, ...updates }));
            toast.success("Changes saved!");
        } catch (error) {
            toast.error("Failed to save changes");
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col bg-black">
                <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
                    Admin Panel
                </h1>

                <nav className="flex-1 space-y-2">
                    <SidebarItem
                        icon={<FaUser />}
                        label="Profile Info"
                        isActive={activeTab === "profile"}
                        onClick={() => setActiveTab("profile")}
                    />
                    <SidebarItem
                        icon={<FaLink />}
                        label="Social Links"
                        isActive={activeTab === "links"}
                        onClick={() => setActiveTab("links")}
                    />
                    {/* <SidebarItem 
            icon={<FaPalette />} 
            label="Appearance" 
            isActive={activeTab === "appearance"} 
            onClick={() => setActiveTab("appearance")} 
          /> */}
                    <SidebarItem
                        icon={<FaMusic />}
                        label="Audio & Media"
                        isActive={activeTab === "media"}
                        onClick={() => setActiveTab("media")}
                    />
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-neutral-900/50">
                <div className="max-w-4xl mx-auto">
                    {activeTab === "profile" && <ProfileForm profile={profile} onSave={handleUpdate} />}
                    {activeTab === "links" && <LinksForm profile={profile} onSave={handleUpdate} />}
                    {/* {activeTab === "appearance" && <AppearanceForm profile={profile} onSave={handleUpdate} />} */}
                    {activeTab === "media" && <MediaForm profile={profile} onSave={handleUpdate} />}
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}

// --- Forms ---

function ProfileForm({ profile, onSave }: { profile: UserProfile, onSave: (data: Partial<UserProfile>) => void }) {
    const [displayName, setDisplayName] = useState(profile.displayName);
    const [bio, setBio] = useState(profile.bio.join("\n"));
    const [quote, setQuote] = useState(profile.quote);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            displayName,
            bio: bio.split("\n").filter(line => line.trim() !== ""),
            quote
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Display Name</label>
                    <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Bio (Typewriter lines)</label>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-32"
                    />
                    <p className="text-xs text-white/40 mt-1">One line per entry (separated by new line)</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Quote</label>
                    <input
                        value={quote}
                        onChange={e => setQuote(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>

            <button onClick={handleSubmit} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center gap-2">
                <FaSave /> Save Changes
            </button>
        </div>
    );
}

function LinksForm({ profile, onSave }: { profile: UserProfile, onSave: (data: Partial<UserProfile>) => void }) {
    const [links, setLinks] = useState(profile.socialLinks || []);

    // Helper to map simplified platform names to icon keys (for display/edit logic if needed)
    // For now, we mainly edit URL and Platform Name.

    const addLink = () => {
        setLinks([...links, { platform: "New Link", url: "", icon: "FaLink" }]);
    };

    const removeLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const updateLink = (index: number, field: keyof typeof links[0], value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setLinks(newLinks);
    };

    const handleSave = () => {
        onSave({ socialLinks: links });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Social Links</h2>
            <div className="space-y-3">
                {links.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-white/5 p-3 rounded-lg border border-white/10">
                        <input
                            value={link.platform}
                            onChange={e => updateLink(idx, "platform", e.target.value)}
                            placeholder="Platform (e.g. Discord)"
                            className="bg-transparent border-b border-white/20 px-2 py-1 outline-none focus:border-indigo-500 w-1/3"
                        />
                        <input
                            value={link.url}
                            onChange={e => updateLink(idx, "url", e.target.value)}
                            placeholder="URL (https://...)"
                            className="bg-transparent border-b border-white/20 px-2 py-1 outline-none focus:border-indigo-500 flex-1"
                        />
                        <button onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-300 p-2">
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 mt-4">
                <button onClick={addLink} className="bg-indigo-600/20 text-indigo-400 border border-indigo-600/50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-600/30 transition-colors flex items-center gap-2">
                    <FaPlus /> Add Link
                </button>
                <button onClick={handleSave} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center gap-2">
                    <FaSave /> Save Changes
                </button>
            </div>
        </div>
    )
}

function MediaForm({ profile, onSave }: { profile: UserProfile, onSave: (data: Partial<UserProfile>) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string, field: keyof UserProfile) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        const toastId = toast.loading("Uploading...");

        try {
            const url = await uploadFile(file, `${path}/${file.name}`);
            onSave({ [field]: url });
            toast.success("Upload successful!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Upload failed", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Audio & Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Upload */}
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Profile Avatar</label>
                    <div className="relative group h-40 w-40 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-indigo-500 transition-all">
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm text-white/80 font-bold">Change</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "avatars", "avatarUrl")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                        />
                    </div>
                </div>

                {/* Song Upload */}
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Song File (MP3)</label>
                    <div className="h-40 w-full bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-white/10 transition-all relative">
                        <FaMusic className="text-3xl text-white/20 mb-2" />
                        <span className="text-sm text-white/40">Click to upload new track</span>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(e, "songs", "songUrl")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                        />
                    </div>
                    <p className="text-xs text-white/30 mt-2 truncate">Current: {profile.songUrl ? "Custom Track Uploaded" : "Default Track"}</p>
                </div>
            </div>
        </div>
    )
}
