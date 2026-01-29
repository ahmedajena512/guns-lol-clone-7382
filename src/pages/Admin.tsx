import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLink, FaPalette, FaMusic, FaSignOutAlt } from "react-icons/fa";

export function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

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
                    <SidebarItem
                        icon={<FaPalette />}
                        label="Appearance"
                        isActive={activeTab === "appearance"}
                        onClick={() => setActiveTab("appearance")}
                    />
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
                    {activeTab === "profile" && <ProfileForm />}
                    {activeTab === "links" && <LinksForm />}
                    {activeTab === "appearance" && <AppearanceForm />}
                    {activeTab === "media" && <MediaForm />}
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

// --- Placeholder Forms ---

function ProfileForm() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Display Name</label>
                    <input className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" placeholder="Ahmed Ajena" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Bio (Typewriter lines)</label>
                    <textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-32" placeholder="Full Stack Developer&#10;Gamer" />
                    <p className="text-xs text-white/40 mt-1">One line per entry</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Quote</label>
                    <input className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" placeholder="Building things..." />
                </div>
            </div>

            <button className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-white/90 transition-colors">
                Save Changes
            </button>
        </div>
    );
}

function LinksForm() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Social Links</h2>
            <p className="text-white/50">Manage your social media buttons.</p>
            {/* TODO: Implement array handling for links */}
            <div className="p-4 border border-dashed border-white/20 rounded-lg text-center text-white/40">
                Link list will appear here
            </div>
            <button className="bg-indigo-600 px-4 py-2 rounded-lg text-white font-medium">Add New Link</button>
        </div>
    )
}

function AppearanceForm() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Appearance</h2>
            <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Theme Color (Browser UI)</label>
                <input type="color" className="bg-transparent h-10 w-20" />
            </div>
        </div>
    )
}

function MediaForm() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Audio & Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Profile Avatar</label>
                    <div className="h-40 w-40 bg-white/5 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-white/10 transition-all">
                        <span className="text-sm text-white/40">Upload</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-3">Song File (MP3)</label>
                    <div className="h-40 w-full bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-white/10 transition-all">
                        <span className="text-sm text-white/40">Upload MP3</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
