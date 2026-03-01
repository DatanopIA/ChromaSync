import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Monitor, Smartphone, X, Check, Apple, Zap } from "lucide-react";

interface DownloadAppButtonProps {
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
}

export default function DownloadAppButton({ variant = "primary", className = "" }: DownloadAppButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallPWA = async () => {
        if (!deferredPrompt) {
            // Fallback for browsers that don't support beforeinstallprompt or if already installed
            alert("Para instalar ChromaSync Aura, usa la opción 'Instalar Aplicación' o 'Añadir a pantalla de inicio' de tu navegador.");
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setDeferredPrompt(null);
            setIsOpen(false);
        }
    };

    const handleDirectDownload = (platform: string) => {
        setIsDownloading(platform);
        const fileName = platform === "macOS" ? "ChromaSync_Aura_macOS.zip" : "ChromaSync_Aura_Windows.zip";
        const link = document.createElement("a");
        link.href = `/downloads/${fileName}`;
        link.download = fileName;

        setTimeout(() => {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsDownloading(null);
            setIsOpen(false);
        }, 1500);
    };

    const buttonStyles = {
        primary: "bg-foreground text-background hover:scale-105 active:scale-95",
        secondary: "bg-background border border-border hover:bg-muted",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all focus:outline-none ${buttonStyles[variant]} ${className}`}
            >
                <Download size={18} />
                <span>Descargar App</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[1000] cursor-crosshair"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-background border border-border shadow-2xl rounded-[40px] p-10 z-[1001] overflow-hidden"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                            <Zap size={14} fill="currentColor" /> Acceso Directo (Beta)
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight">Obtén la experiencia Aura</h2>
                                        <p className="text-muted-foreground text-sm max-w-sm">
                                            Instala la versión nativa o web de forma instantánea sin pasar por tiendas.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Cerrar modal"
                                        title="Cerrar"
                                        className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {/* Desktop Platforms */}
                                    <div className="flex flex-col gap-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Desktop (Descarga Directa)</span>
                                        <button
                                            onClick={() => handleDirectDownload("macOS")}
                                            className="flex items-center gap-4 p-5 rounded-3xl bg-muted/50 border border-transparent hover:border-cyan-400/30 hover:bg-muted transition-all text-left relative overflow-hidden group shadow-sm"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-md">
                                                {isDownloading === "macOS" ? <RefreshCw className="animate-spin text-cyan-400" size={24} /> : <Apple size={24} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">macOS</span>
                                                <span className="text-[10px] text-muted-foreground">Universal Installer</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleDirectDownload("Windows")}
                                            className="flex items-center gap-4 p-5 rounded-3xl bg-muted/50 border border-transparent hover:border-cyan-400/30 hover:bg-muted transition-all text-left relative overflow-hidden group shadow-sm"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-md">
                                                {isDownloading === "Windows" ? <RefreshCw className="animate-spin text-cyan-400" size={24} /> : <Monitor size={24} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Windows</span>
                                                <span className="text-[10px] text-muted-foreground">EXE Installer</span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Mobile/PWA Platforms */}
                                    <div className="flex flex-col gap-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Móvil (Instalación Instantánea)</span>
                                        <button
                                            onClick={handleInstallPWA}
                                            aria-label="Instalar como aplicación web"
                                            title="Instalar PWA"
                                            className="grow flex flex-col justify-between p-8 rounded-[2rem] bg-foreground text-background hover:scale-[1.02] transition-all text-left relative overflow-hidden shadow-xl ring-offset-background focus:ring-2 ring-foreground"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                    <Smartphone size={28} />
                                                </div>
                                                <div className="bg-cyan-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Sin Tiendas</div>
                                            </div>
                                            <div className="flex flex-col gap-1 mt-4">
                                                <span className="font-black text-xl leading-none italic uppercase">INSTALAR AHORA</span>
                                                <span className="text-[10px] opacity-70 leading-tight">Funciona en iPhone y Android sin descargas externas.</span>
                                            </div>
                                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-400/30 blur-3xl rounded-full" />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-medium leading-none">Más de 15k creativos<br />ya usan Aura Nativo.</span>
                                    </div>
                                    <div className="text-[9px] text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-mono">v1.2.0-beta</div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function RefreshCw({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}
