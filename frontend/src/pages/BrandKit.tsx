import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useAura } from "../context/AuraContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, Type, Layout, Palette, Check, Upload, Trash2, ExternalLink, FileText, Code, Share2, Globe, Copy as CopyIcon, Layers } from "lucide-react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const projects = [
    { id: 1, name: "Cyberpunk Neon", colors: ["#FF003C", "#00E5FF", "#FCEE0A", "#1A1A1A", "#FFFFFF"], date: "2 days ago", isAI: true },
    { id: 2, name: "Soft Minimal", colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD"], date: "1 week ago", isAI: false },
    { id: 3, name: "Earthy Tones", colors: ["#8B5A2B", "#CD853F", "#DEB887", "#F5DEB3", "#FFF8DC"], date: "2 weeks ago", isAI: false },
    { id: 4, name: "Ocean Breeze", colors: ["#00B4DB", "#0083B0", "#E0EAFC", "#CFDEF3", "#FFFFFF"], date: "1 month ago", isAI: true },
    { id: 5, name: "Vintage Retro", colors: ["#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#264653"], date: "2 months ago", isAI: false },
    { id: 6, name: "Dark Mode UI", colors: ["#121212", "#1E1E1E", "#BB86FC", "#03DAC6", "#CF6679"], date: "3 months ago", isAI: true },
];

const googleFonts = [
    { name: "Inter", family: "'Inter', sans-serif" },
    { name: "Montserrat", family: "'Montserrat', sans-serif" },
    { family: "'Playfair Display', serif", name: "Playfair Display" },
    { family: "'Space Grotesque', sans-serif", name: "Space Grotesque" },
    { family: "'Outfit', sans-serif", name: "Outfit" },
    { family: "'Bormiolo', sans-serif", name: "Bormiolo" },
];

export default function BrandKit() {
    const { user, savePalette, getPalette, signInWithGoogle, deletePalette } = useAura();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialProject = projects.find(p => p.id === Number(id)) || projects[0];

    // Check if we have a remix in state
    const isRemix = !!location.state?.colors;
    const currentProject = isRemix ? { ...initialProject, colors: location.state.colors, name: location.state.name || "Remix Palette" } : initialProject;

    const [paletteColors, setPaletteColors] = useState<string[]>(currentProject.colors);

    // Color states
    const [activeCombo, setActiveCombo] = useState(0);
    const [primary, setPrimary] = useState(currentProject.colors[0]);
    const [secondary, setSecondary] = useState(currentProject.colors[1]);
    const [background, setBackground] = useState(currentProject.colors[4] || "#FFFFFF");
    const [accent, setAccent] = useState(currentProject.colors[2]);

    // Update states if location state changes (for secondary navigation)
    useEffect(() => {
        if (location.state?.colors) {
            setPrimary(location.state.colors[0]);
            setSecondary(location.state.colors[1]);
            setAccent(location.state.colors[2]);
            setBackground(location.state.colors[4] || "#FFFFFF");
            setKitName(location.state.name || "Remix Palette");
            setPaletteColors(location.state.colors);
        }
    }, [location.state]);

    // Typography states
    const [selectedFont, setSelectedFont] = useState(googleFonts[0]);
    const [customFontName, setCustomFontName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    // Save & Export states
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [kitName, setKitName] = useState(currentProject.name);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingPalette, setIsLoadingPalette] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [exportType, setExportType] = useState<string | null>(null);

    // Load palette from DB if ID is provided and it's not a remix
    useEffect(() => {
        const loadRealPalette = async () => {
            if (id && !isRemix && id.length > 5) { // IDs de base de datos suelen ser más largos que los mock IDs (1-6)
                setIsLoadingPalette(true);
                try {
                    const data = await getPalette(id);
                    if (data) {
                        setPrimary(data.colors[0]?.hex || "#000000");
                        setSecondary(data.colors[1]?.hex || "#000000");
                        setAccent(data.colors[2]?.hex || "#000000");
                        setBackground(data.colors[4]?.hex || "#FFFFFF");
                        setKitName(data.name);
                        setPaletteColors(data.colors.map((c: any) => c.hex));
                    }
                } catch (error) {
                    console.error("Error loading palette from DB:", error);
                } finally {
                    setIsLoadingPalette(false);
                }
            }
        };
        loadRealPalette();
    }, [id, isRemix, getPalette]);

    // Inject Google Fonts
    useEffect(() => {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&family=Space+Grotesque:wght@400;700&family=Outfit:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (user?.plan === 'FREE') {
            alert("La subida de tipografías personalizadas es una función PLUS. Por favor, actualiza tu plan.");
            navigate('/pricing');
            return;
        }
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fontFace = new FontFace('CustomUserFont', `url(${event.target?.result})`);
                fontFace.load().then((loadedFace) => {
                    document.fonts.add(loadedFace);
                    setSelectedFont({ name: file.name.split('.')[0], family: "'CustomUserFont', sans-serif" });
                    setCustomFontName(file.name);
                });
            };
            reader.readAsDataURL(file);
        }
    };

    function getContrast(hexcolor: string) {
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#ffffff';
    }

    const handleSave = async () => {
        if (!kitName.trim()) return;

        if (!user) {
            alert("Debes iniciar sesión para guardar tu Brand Kit en la nube.");
            signInWithGoogle();
            return;
        }

        setIsSaving(true);
        try {
            await savePalette({
                name: kitName,
                colors: [
                    { hex: primary, name: "Primary" },
                    { hex: secondary, name: "Secondary" },
                    { hex: background, name: "Background" },
                    { hex: accent, name: "Accent" }
                ],
                // Metadata adicional para el Kit
                typography_suggestion: {
                    heading: selectedFont.name,
                    body: selectedFont.name
                }
            } as any); // Cast as any a esperar que la API ignore o acepte la tipografía si lo extendemos

            setIsSaving(false);
            setIsSaveModalOpen(false);
            setSuccessMessage(`¡Brand Kit "${kitName}" guardado con éxito!`);
            setShowSuccess(true);

            // Efecto de celebración
            import('canvas-confetti').then(confetti => {
                confetti.default({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [primary, secondary, accent]
                });
            });

            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error("Save error:", error);
            alert("Hubo un error al intentar guardar en la nube. Por favor, inténtalo de nuevo.");
            setIsSaving(false);
        }
    };

    const downloadCode = (type: 'css' | 'json') => {
        const data = type === 'css'
            ? `:root {\n  --primary: ${primary};\n  --secondary: ${secondary};\n  --background: ${background};\n  --accent: ${accent};\n  --font-family: ${selectedFont.family};\n}`
            : JSON.stringify({
                name: kitName,
                colors: { primary, secondary, background, accent },
                typography: selectedFont
            }, null, 2);

        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${kitName.toLowerCase().replace(/\s+/g, '-')}.${type}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExport = async (type: string) => {
        // Gates for FREE users
        if (user?.plan === 'FREE' && ['pdf', 'canva', 'figma'].includes(type)) {
            alert("Las exportaciones avanzadas (PDF, Canva, Figma) son exclusivas para usuarios PLUS y PRO.");
            navigate('/pricing');
            return;
        }

        setExportType(type);
        setIsSaving(true);

        try {
            if (type === 'css' || type === 'json') {
                downloadCode(type as 'css' | 'json');
                setSuccessMessage(`¡Código ${type.toUpperCase()} descargado con éxito!`);
            } else if (type === 'copy') {
                const text = `Brand: ${kitName}\nPrimary: ${primary}\nSecondary: ${secondary}\nAccent: ${accent}\nBackground: ${background}\nFont: ${selectedFont.name}`;
                navigator.clipboard.writeText(text);
                setSuccessMessage("¡Activos copiados al portapapeles!");
            } else if (type === 'pdf') {
                if (previewRef.current) {
                    const canvas = await html2canvas(previewRef.current, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: '#FFFFFF',
                        logging: false
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${kitName.toLowerCase().replace(/\s+/g, '-')}-brand-guide.pdf`);
                    setSuccessMessage("¡Guía de marca PDF visual generada!");
                }
            } else if (type === 'canva') {
                // Redirect to Canva Brand Kits
                window.open('https://www.canva.com/brand-kits', '_blank');
                setSuccessMessage("¡Redirigiendo a Canva!");
            } else if (type === 'figma') {
                // Redirect to Figma
                window.open('https://www.figma.com', '_blank');
                setSuccessMessage("¡Redirigiendo a Figma!");
            } else {
                setSuccessMessage(`¡Exportación a ${type.toUpperCase()} completada!`);
            }

            // Common success cleanup
            setIsExportModalOpen(false);
            setExportType(null);
            setShowSuccess(true);

            import('canvas-confetti').then(confetti => {
                confetti.default({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [primary, secondary, accent]
                });
            });

            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error) {
            console.error("Export error:", error);
            setSuccessMessage("Error al exportar el archivo.");
            setShowSuccess(true);
        } finally {
            setIsSaving(false);
        }
    };

    const shuffleColors = () => {
        const shuffled = [...paletteColors].sort(() => Math.random() - 0.5);
        setPrimary(shuffled[0]);
        setSecondary(shuffled[1]);
        setBackground(shuffled[4] || "#FFFFFF");
        setAccent(shuffled[2]);
        setActiveCombo(prev => prev + 1);
    };

    return (
        <div className="w-full min-h-screen bg-white" style={{ fontFamily: selectedFont.family }}>
            {/* Top Nav */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center justify-between font-sans">
                <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm uppercase tracking-widest hidden sm:inline">Back</span>
                    </Link>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={shuffleColors}
                            className="flex items-center gap-2 px-3 md:px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black rounded-full text-xs md:text-sm font-bold transition-all active:scale-95"
                            title="Shuffle Layout"
                        >
                            <RefreshCw size={16} /> <span className="hidden sm:inline">Shuffle</span>
                        </button>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex items-center gap-2 px-3 md:px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-black rounded-full text-xs md:text-sm font-bold transition-all active:scale-95"
                            title="Export"
                        >
                            <Download size={16} /> <span className="hidden sm:inline">Export</span>
                        </button>
                        <button
                            onClick={() => setIsSaveModalOpen(true)}
                            className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-black text-white rounded-full text-xs md:text-sm font-bold shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-95"
                            title="Save Kit"
                        >
                            <Check size={16} /> <span className="hidden sm:inline">Save Kit</span>
                            <span className="sm:hidden">Save</span>
                        </button>
                        {id && id !== 'new' && (
                            <button
                                onClick={async () => {
                                    if (confirm("¿Estás seguro de que quieres borrar este Brand Kit?")) {
                                        try {
                                            await deletePalette(id);
                                            navigate('/projects');
                                        } catch (err) {
                                            alert("Error al borrar el kit.");
                                        }
                                    }
                                }}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95"
                                title="Borrar este kit"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-sans"
                    >
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <Check size={14} />
                        </div>
                        <span className="font-bold">{successMessage || `¡Brand Kit "${kitName}" guardado con éxito!`}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Save Modal */}
            <AnimatePresence>
                {isSaveModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSaveModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[40px] p-10 z-[110] shadow-2xl font-sans"
                        >
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-3xl font-bold tracking-tight">Guardar Brand Kit</h2>
                                    <p className="text-gray-500">Dale un nombre memorable a tu creación para encontrarla más tarde.</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="kit-name" className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Nombre del Kit</label>
                                    <input
                                        id="kit-name"
                                        type="text"
                                        value={kitName}
                                        onChange={(e) => setKitName(e.target.value)}
                                        placeholder="Ej. Minimalist Summer..."
                                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all text-lg font-medium"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsSaveModalOpen(false)}
                                        className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !kitName.trim()}
                                        className="flex-1 px-8 py-4 bg-black text-white hover:bg-gray-800 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <RefreshCw size={18} className="animate-spin" /> Guardando...
                                            </>
                                        ) : (
                                            "Confirmar"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Export Modal */}
            <AnimatePresence>
                {isExportModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExportModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[40px] p-10 z-[110] shadow-2xl font-sans"
                        >
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-2 text-center items-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-2">
                                        <Download size={32} className="text-black" />
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight">Export Brand Kit</h2>
                                    <p className="text-gray-500 max-w-md">Choose your preferred format to take your brand identity to the next level.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'pdf', name: 'Brand Guide (PDF)', icon: <FileText size={20} />, desc: 'Full aesthetic documentation.', premium: true },
                                        { id: 'canva', name: 'Canva Layout', icon: <Layers size={20} />, desc: 'Ready for social media.', premium: true },
                                        { id: 'figma', name: 'Figma Tokens', icon: <Share2 size={20} />, desc: 'For professional designers.', premium: true },
                                        { id: 'css', name: 'CSS Variables', icon: <Code size={20} />, desc: 'Implementation ready.', premium: false },
                                        { id: 'json', name: 'JSON Data', icon: <Globe size={20} />, desc: 'For custom API integration.', premium: false },
                                        { id: 'copy', name: 'Copy Assets', icon: <CopyIcon size={20} />, desc: 'Paste directly anywhere.', premium: false },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleExport(opt.id)}
                                            disabled={isSaving && exportType !== opt.id}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all hover:border-black flex gap-4 items-center group relative
                                                ${exportType === opt.id ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50/50'}
                                            `}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                                                ${exportType === opt.id ? 'bg-white/20' : 'bg-white shadow-sm group-hover:bg-black group-hover:text-white'}
                                            `}>
                                                {opt.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{opt.name}</span>
                                                    {opt.premium && user?.plan === 'FREE' && (
                                                        <span className="bg-amber-500 text-[8px] text-white px-1.5 py-0.5 rounded-full uppercase font-black">Plus</span>
                                                    )}
                                                </div>
                                                <span className={`text-[10px] ${exportType === opt.id ? 'text-white/60' : 'text-gray-400'}`}>{opt.desc}</span>
                                            </div>
                                            {isSaving && exportType === opt.id && (
                                                <RefreshCw size={18} className="animate-spin ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setIsExportModalOpen(false)}
                                    className="w-full py-4 text-gray-400 hover:text-black font-bold transition-colors text-sm uppercase tracking-widest"
                                >
                                    Not now, stay in editor
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 lg:h-[calc(100vh-80px)] overflow-hidden">

                {/* Sidebar Controls */}
                <aside className="lg:col-span-3 border-r border-gray-100 p-8 flex flex-col gap-10 overflow-y-auto lg:h-full font-sans bg-white">

                    {/* Colors Section */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Palette size={14} /> Color Mapping
                        </h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Main Bg", color: background, set: setBackground },
                                { label: "Primary", color: primary, set: setPrimary },
                                { label: "Secondary", color: secondary, set: setSecondary },
                                { label: "Accent", color: accent, set: setAccent },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                        <span>{item.label}</span>
                                        <span>{item.color}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {paletteColors.map((c, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => item.set(c)}
                                                className={`w-full h-8 rounded-lg transition-all ${item.color === c ? 'ring-2 ring-black ring-offset-2 scale-110 z-10' : 'hover:scale-105 opacity-80'}`}
                                                style={{ backgroundColor: c }}
                                                aria-label={`Seleccionar color ${c} para ${item.label}`}
                                                title={`Seleccionar color ${c}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Typography Section */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Type size={14} /> Typography
                        </h3>

                        <div className="flex flex-col gap-4">
                            {/* Google Fonts Selector */}
                            <div className="grid grid-cols-1 gap-2">
                                {googleFonts.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => { setSelectedFont(font); setCustomFontName(null); }}
                                        className={cn(
                                            "group w-full p-4 rounded-xl border text-left transition-all duration-200",
                                            selectedFont.name === font.name && !customFontName
                                                ? "border-black bg-black text-white shadow-lg"
                                                : "border-gray-100 hover:border-gray-300 bg-white"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">{font.name}</span>
                                            {selectedFont.name === font.name && !customFontName && <Check size={12} />}
                                        </div>
                                        <span className="text-lg" style={{ fontFamily: font.family }}>The quick brown fox</span>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Font Upload */}
                            <div className="mt-4 pt-6 border-t border-gray-100">
                                <label htmlFor="font-upload" className="sr-only">Subir tipografía personalizada</label>
                                <input
                                    id="font-upload"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".ttf,.otf,.woff,.woff2"
                                    className="hidden"
                                />

                                {customFontName ? (
                                    <div className="p-4 rounded-xl bg-gray-50 border border-black flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Custom Font</span>
                                            <span className="font-bold truncate max-w-[150px]">{customFontName}</span>
                                        </div>
                                        <button
                                            onClick={() => { setCustomFontName(null); setSelectedFont(googleFonts[0]); }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            aria-label="Eliminar tipografía personalizada"
                                            title="Eliminar tipografía personalizada"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (user?.plan === 'FREE') {
                                                alert("La subida de tipografías personalizadas es una función PLUS. Por favor, actualiza tu plan.");
                                                navigate('/pricing');
                                                return;
                                            }
                                            fileInputRef.current?.click();
                                        }}
                                        className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all flex flex-col items-center gap-2 text-gray-400 hover:text-black group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Upload size={20} />
                                            {user?.plan === 'FREE' && (
                                                <span className="bg-amber-500 text-[8px] text-white px-1.5 py-0.5 rounded-full uppercase font-black">Plus</span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest">Upload Custom Font</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Live Preview Area */}
                <main className="lg:col-span-9 p-6 md:p-12 lg:p-20 bg-gray-50/50 flex flex-col items-center justify-start overflow-y-auto lg:h-full">
                    <motion.div
                        key={activeCombo}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        ref={previewRef}
                        className="w-full max-w-6xl flex flex-col gap-8 md:gap-12"
                    >
                        {/* Main Brand Showcase */}
                        <div
                            className="w-full aspect-square md:aspect-[21/9] rounded-[32px] md:rounded-[48px] p-8 md:p-12 shadow-2xl flex flex-col justify-center items-center text-center gap-6 relative overflow-hidden transition-all duration-700"
                            style={{ backgroundColor: background }}
                        >
                            {/* Decorative background shapes */}
                            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 blur-[80px] md:blur-[120px] rounded-full opacity-20" style={{ backgroundColor: primary }} />
                            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 blur-[80px] md:blur-[120px] rounded-full opacity-20" style={{ backgroundColor: secondary }} />

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-500"
                                style={{ backgroundColor: primary, color: background }}
                            >
                                <Palette size={40} />
                            </motion.div>

                            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-none" style={{ color: primary }}>
                                Craft your identity.
                            </h2>
                            <p className="max-w-xl text-lg md:text-xl opacity-60 leading-relaxed" style={{ color: primary }}>
                                Experiment with {kitName} palette and <span className="font-bold underline">{selectedFont.name}</span> typography to create a high-end visual language.
                            </p>
                            <button className="px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest mt-4 shadow-xl hover:scale-105 transition-transform" style={{ backgroundColor: secondary, color: background === '#FFFFFF' ? '#000' : '#FFF' }}>
                                Explore Vision
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                            {/* Column 1: Business Card & Interaction State */}
                            <div className="flex flex-col gap-6 md:gap-8">
                                {/* Business Card Mockup */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="aspect-[1.6/1] rounded-[32px] p-6 md:p-8 shadow-xl relative overflow-hidden group cursor-pointer border border-black/5"
                                    style={{ backgroundColor: primary }}
                                >
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                <Palette size={20} style={{ color: getContrast(primary) }} />
                                            </div>
                                            <div className="text-[10px] uppercase font-bold tracking-widest leading-none opacity-50" style={{ color: getContrast(primary) }}>Aura Design</div>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="font-bold text-lg md:text-xl tracking-tight leading-none" style={{ color: getContrast(primary) }}>Meritxell Gimenez</div>
                                            <div className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60" style={{ color: getContrast(primary) }}>Brand Director</div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-40" style={{ backgroundColor: secondary }} />
                                </motion.div>

                                {/* Interaction State Panel */}
                                <div className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm flex flex-col gap-6">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 font-sans">Components</h4>
                                    <div className="flex flex-col gap-3">
                                        <div className="p-4 rounded-xl flex items-center justify-between text-white shadow-lg" style={{ backgroundColor: primary }}>
                                            <span className="font-bold text-sm">Primary Action</span>
                                            <ExternalLink size={14} />
                                        </div>
                                        <div className="p-4 rounded-xl flex items-center justify-between border-2 border-dashed" style={{ borderColor: secondary + '40', color: secondary }}>
                                            <span className="font-bold text-sm">Ghost Button</span>
                                        </div>
                                        <div className="p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: accent + '10', color: accent }}>
                                            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Active State</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Web Interface & Chart */}
                            <div className="flex flex-col gap-6 md:gap-8">
                                {/* Web Interface Item */}
                                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                    <div className="h-10 px-4 border-b border-gray-50 flex items-center gap-1.5 bg-gray-50/50">
                                        <div className="w-2 h-2 rounded-full bg-red-400/30" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-400/30" />
                                        <div className="w-2 h-2 rounded-full bg-green-400/30" />
                                    </div>
                                    <div className="p-8 flex flex-col gap-6" style={{ backgroundColor: background + '10' }}>
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-xl shadow-inner" style={{ backgroundColor: primary }} />
                                            <div className="flex gap-3">
                                                <div className="h-1.5 w-8 rounded-full bg-current opacity-10" />
                                                <div className="h-1.5 w-8 rounded-full bg-current opacity-10" />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold leading-tight tracking-tight" style={{ color: primary }}>Build with {selectedFont.name}.</h3>
                                        <p className="text-sm opacity-60 leading-relaxed font-sans" style={{ color: primary }}>
                                            A seamless balance between form and function.
                                        </p>
                                        <div className="h-px w-full bg-current opacity-5" />
                                        <div className="flex gap-2">
                                            <div className="h-6 w-20 rounded-lg" style={{ backgroundColor: secondary + '20' }} />
                                            <div className="h-6 w-20 rounded-lg" style={{ backgroundColor: accent + '20' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Stat Box */}
                                <div className="p-8 rounded-[32px] shadow-xl flex flex-col gap-4 relative overflow-hidden group" style={{ backgroundColor: background }}>
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${primary} 1px, transparent 0)`, backgroundSize: '16px 16px' }} />
                                    <div className="relative z-10">
                                        <div className="h-1 w-12 rounded-full mb-4" style={{ backgroundColor: secondary }} />
                                        <h5 className="text-5xl font-bold leading-none tracking-tighter" style={{ color: primary }}>98.2%</h5>
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mt-2" style={{ color: primary }}>Design Accuracy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Mobile Identity (Tall) */}
                            <div className="flex flex-col gap-6 md:gap-8 h-full">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 flex flex-col items-center gap-8 text-center relative overflow-hidden h-full min-h-[500px]"
                                >
                                    <div className="absolute inset-x-0 top-0 h-40 transition-all" style={{ backgroundColor: background + '40' }} />
                                    <div className="relative z-10 flex flex-col items-center gap-6 pt-4 w-full">
                                        <div className="w-24 h-24 rounded-[32px] p-1 shadow-2xl overflow-hidden bg-white ring-8 ring-white/50">
                                            <img src="https://i.pravatar.cc/150?u=brand" className="w-full h-full object-cover" alt="User" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-2xl font-bold tracking-tight" style={{ color: primary }}>Official Kit</h4>
                                            <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40" style={{ color: primary }}>Verified Identity</p>
                                        </div>
                                        <div className="flex flex-col gap-3 w-full mt-4">
                                            <button className="w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.02]" style={{ backgroundColor: primary, color: background }}>View Profile</button>
                                            <button className="w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border-2 transition-all hover:bg-gray-50" style={{ borderColor: secondary, color: secondary }}>Collaborate</button>
                                        </div>
                                    </div>
                                    <div className="mt-auto w-full flex flex-col gap-4">
                                        <div className="flex justify-between items-end gap-2 px-2">
                                            {[40, 70, 100, 60, 85].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t-lg opacity-20" style={{ backgroundColor: primary, height: `${h}px` }} />
                                            ))}
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: accent }} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Typography Spec Card */}
                        <div className="w-full bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                            <div className="flex-1 flex flex-col gap-6 w-full md:w-auto">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Visual spec</span>
                                <h2 className="text-5xl md:text-6xl font-bold" style={{ color: primary }}>Aa</h2>
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl md:text-5xl font-bold" style={{ color: primary }}>{selectedFont.name}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {["Regular", "Medium", "Semibold", "Bold"].map(weight => (
                                            <span key={weight} className="text-[10px] md:text-xs uppercase font-bold tracking-widest opacity-50" style={{ color: primary }}>{weight}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-4 p-6 md:p-8 rounded-[24px] md:rounded-[32px] w-full" style={{ backgroundColor: background + '20' }}>
                                <p className="text-lg md:text-2xl leading-relaxed" style={{ color: primary }}>
                                    ChromaSync Aura provides a seamless integration between color psychology and typography.
                                    <span className="inline-block px-2 ml-1 rounded" style={{ backgroundColor: secondary, color: background }}>Design is thinking</span> made visual.
                                </p>
                                <div className="mt-4 flex flex-col gap-2">
                                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                                    <div className="h-2 w-3/4 bg-gray-100 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>

            </div>
        </div>
    );
}
