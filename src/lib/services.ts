import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "./firebase";

// Define the shape of our User Profile
export interface UserProfile {
    displayName: string;
    bio: string[]; // Array of strings for typewriter effect
    quote: string;
    themeColor: string;
    avatarUrl: string;
    backgroundUrl: string;
    songUrl: string;
    songTitle: string;
    songArtist: string;
    socialLinks: SocialLinkData[];
}

export interface SocialLinkData {
    platform: string;
    url: string;
    icon: string; // We'll store the icon name string
}

// Default values to use if no profile exists
export const DEFAULT_PROFILE: UserProfile = {
    displayName: "Ahmed Ajena",
    bio: ["Full Stack Developer", "Gamer", "UI/UX Enthusiast"],
    quote: "Building things for the web. Breaking things for fun.",
    themeColor: "#000000",
    avatarUrl: "https://cdn.discordapp.com/avatars/623142760240775168/76dc609952bafba97b5547809966a174.webp",
    backgroundUrl: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=2070&auto=format&fit=crop",
    songUrl: "", // We'll handle the default import logic in the component if this is empty
    songTitle: "SHAKE SUM",
    songArtist: "Cutty Vibez",
    socialLinks: [
        { platform: "Discord", url: "https://discord.com/users/623142760240775168", icon: "FaDiscord" },
        { platform: "GitHub", url: "https://github.com/ahmedajena512", icon: "FaGithub" }
    ]
};

const COLLECTION_NAME = "users";
const DOC_ID = "profile"; // Single profile for now

// --- Firestore Operations ---

export const getProfile = async (): Promise<UserProfile> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            // Create initial profile if it doesn't exist
            await setDoc(docRef, DEFAULT_PROFILE);
            return DEFAULT_PROFILE;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        return DEFAULT_PROFILE;
    }
};

export const updateProfile = async (data: Partial<UserProfile>) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

// --- Storage Operations ---

export const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
