import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Success!
            toast.success("Welcome back!");
            navigate("/admin");
        } catch (error: any) {
            console.error(error);
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 p-8 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-center">Admin Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded bg-white/5 p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded bg-white/5 p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button type="submit" className="w-full rounded bg-indigo-600 p-2 font-bold hover:bg-indigo-500 transition-colors">
                    Login
                </button>
            </form>
        </div>
    );
}
