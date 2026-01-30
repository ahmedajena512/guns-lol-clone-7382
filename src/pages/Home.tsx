import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaDiscord,
    FaGithub,
    FaTelegramPlane,
    FaSpotify,
    FaFacebook,
    FaInstagram,
    FaPinterest,
    FaPlay,
    FaPause,
    FaForward,
    FaBackward,
    FaVolumeUp,
    FaVolumeMute,
    FaLink
} from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { getProfile, UserProfile, DEFAULT_PROFILE } from "../lib/services";
import defaultSong from "../assets/shake_sum.mp3";

// Helper to resolve icon string to Component
const IconMap: Record<string, any> = {
    FaDiscord, FaGithub, FaTelegramPlane, FaSpotify,
    FaFacebook, FaInstagram, FaPinterest, FaLink
};

export function Home() {
    const [entered, setEntered] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // Initialize synchronously from cache or default to avoid initial null state (Blocking Render replaced with Optimistic UI)
    const [profile, setProfile] = useState<UserProfile>(() => {
        const cached = localStorage.getItem("user_profile");
        return cached ? JSON.parse(cached) : DEFAULT_PROFILE;
    });

    useEffect(() => {
        // Fetch fresh data in background (SWR pattern)
        getProfile()
            .then(data => {
                setProfile(data);
                localStorage.setItem("user_profile", JSON.stringify(data));
            })
            .catch(error => {
                console.warn("Background fetch failed, keeping cached/default data", error);
            });
    }, []);

    const handleEnter = () => {
        setEntered(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-mono selection:bg-white selection:text-black">
            {/* Background with overlay */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale-[50%]"
                style={{ backgroundImage: `url(${profile.backgroundUrl})` }}
            />

            {/* Moving gradient mesh / fog effect overlay */}
            <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
            <div className="fixed inset-0 z-0 bg-black/60" />

            {/* Audio Element */}
            {/* Use key to force reload if url changes */}
            <audio ref={audioRef} src={profile.songUrl || defaultSong} loop key={profile.songUrl || "default"} />

            <AnimatePresence>
                {!entered ? (
                    <EnterScreen key="enter" onEnter={handleEnter} />
                ) : (
                    <Profile key="profile" audioRef={audioRef} profile={profile} />
                )}
            </AnimatePresence>

            {/* Corner UID / View Counter Mock */}
            {entered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="fixed bottom-4 left-4 text-xs text-white/30 z-50 pointer-events-none"
                >
                    UID: 1337 • Views: 12,402
                </motion.div>
            )}
        </div>
    );
}

function EnterScreen({ onEnter }: { onEnter: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black"
            onClick={onEnter}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <p className="text-xl font-bold tracking-widest text-white animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    click to enter
                </p>
            </motion.div>
        </motion.div>
    );
}

function Profile({ audioRef, profile }: { audioRef: React.RefObject<HTMLAudioElement | null>, profile: UserProfile }) {
    // Construct sequence for TypeAnimation
    // [ "text", 2000, "text2", 2000 ]
    const typeSequence: (string | number)[] = [];
    profile.bio.forEach(line => {
        typeSequence.push(line);
        typeSequence.push(2000);
    });
    if (typeSequence.length === 0) typeSequence.push("Welcome", 2000);

    return (
        <motion.div
            className="relative z-10 flex min-h-screen items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                {/* Profile Header */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <motion.div
                            className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-75 blur"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="relative h-32 w-32 rounded-full border-2 border-white/20 object-cover shadow-2xl"
                        />
                        {/* Status Indicator */}
                        <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-black" title="Online" />
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-white drop-shadow-md">
                            {profile.displayName}
                        </h1>

                        <div className="h-6 text-sm text-gray-300">
                            <TypeAnimation
                                key={typeSequence.join("")} // Force re-render if sequence changes
                                sequence={typeSequence}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>

                        <p className="mt-2 px-4 text-xs italic text-white/50">
                            "{profile.quote}"
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Social Links */}
                <div className="flex flex-wrap justify-center gap-4">
                    {profile.socialLinks && profile.socialLinks.map((link, idx) => {
                        const IconComponent = IconMap[link.icon as keyof typeof IconMap] || FaLink;
                        // Add color mapping logic if desired, for now defaulting to white/hover white
                        return (
                            <SocialLink
                                key={idx}
                                href={link.url}
                                icon={<IconComponent />}
                                label={link.platform}
                                color="hover:text-white"
                            />
                        );
                    })}
                </div>

                {/* Sound Player */}
                <div className="mt-8">
                    <SoundPlayer
                        audioRef={audioRef}
                        songImage={DEFAULT_PROFILE.songUrl} // Or add album art to schema if needed
                        title={profile.songTitle}
                        artist={profile.songArtist}
                    />
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-[10px] text-white/20">
                    © 2025 {profile.displayName}. All rights reserved.
                </div>
            </div>
        </motion.div>
    );
}

function SocialLink({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xl text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-white/10 ${color}`}
            title={label}
        >
            {icon}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {label}
            </span>
        </a>
    );
}

function SoundPlayer({ audioRef, songImage, title, artist }: { audioRef: React.RefObject<HTMLAudioElement | null>, songImage: string, title?: string, artist?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.3);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set initial state
        setIsPlaying(!audio.paused);
        setDuration(audio.duration || 0);
        setCurrentTime(audio.currentTime || 0);

        const updateProgress = () => {

            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const handleVolumeChangeStr = (e: Event) => {
            const target = e.target as HTMLAudioElement;
            setVolume(target.volume);
            setIsMuted(target.muted);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("loadedmetadata", handleMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("volumechange", handleVolumeChangeStr);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("loadedmetadata", handleMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("volumechange", handleVolumeChangeStr);
        };
    }, [audioRef]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value);
        if (audioRef.current) {
            const newTime = (newProgress / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // We use a fixed album art for now, or fetch from profile if we added it to schema
    // For the "classic" look requested, user kept using static image. 
    // We can pass songImage as prop if updated.
    const ALBUM_ART = "https://static.qobuz.com/images/covers/ib/hy/jsing19kfhyib_600.jpg";

    return (
        <div className="w-full rounded-lg bg-white/5 border border-white/10 p-3 backdrop-blur-md flex gap-3">
            {/* Album Art (Spinning) */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-white/10">
                <img
                    src={ALBUM_ART}
                    alt="Album Art"
                    className="h-full w-full object-cover "
                />
            </div>

            {/* Player Content */}
            <div className="flex flex-1 flex-col justify-center gap-1">
                {/* Song Info & Controls */}
                <div className="mb-1 flex items-center justify-between">
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white/90 truncate">{title || "SHAKE SUM"}</p>
                        <p className="text-[10px] text-white/50 truncate">{artist || "Cutty Vibez"}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3 text-white/80">
                        <button className="hover:text-white transition-colors">
                            <FaBackward size={10} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <FaPause size={8} /> : <FaPlay size={8} className="ml-0.5" />}
                        </button>

                        <button className="hover:text-white transition-colors">
                            <FaForward size={10} />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white/50 font-mono w-6 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleSeek}
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-white hover:bg-white/30 transition-colors"
                    />
                    <span className="text-[9px] text-white/50 font-mono w-6">{formatTime(duration)}</span>
                </div>

                {/* Volume Control (Integrated) */}
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <button onClick={toggleMute} className="text-white/40 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <FaVolumeMute size={8} /> : <FaVolumeUp size={8} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="h-1 w-12 cursor-pointer appearance-none rounded-full bg-white/10 accent-white hover:bg-white/20 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
