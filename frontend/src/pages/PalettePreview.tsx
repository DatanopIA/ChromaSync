import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Download, Copy, Check, Layout as LayoutIcon, Smartphone, CreditCard, PieChart, Zap } from "lucide-react";
import { useState } from "react";
import { useAura } from "../context/AuraContext";

const communityPalettes = [
    { id: 1, author: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah", name: "Neon Nights", colors: ["#FF003C", "#00E5FF", "#FCEE0A", "#1A1A1A", "#FFFFFF"], mood: "energetic" },
    { id: 2, author: "Mike T.", avatar: "https://i.pravatar.cc/150?u=mike", name: "Forest Calm", colors: ["#2C5F2D", "#97BC62", "#D4E09B", "#F6F4D2", "#CBDFBD"], mood: "calm" },
    { id: 3, author: "Elena R.", avatar: "https://i.pravatar.cc/150?u=elena", name: "Sunset Vibes", colors: ["#FF7B54", "#FFB26B", "#FFD56F", "#939B62", "#F4F4F0"], mood: "warm" },
    { id: 4, author: "David L.", avatar: "https://i.pravatar.cc/150?u=david", name: "Cyberpunk 2077", colors: ["#FCEE0A", "#00E5FF", "#FF003C", "#1A1A1A", "#000000"], mood: "energetic" },
    { id: 5, author: "Anna K.", avatar: "https://i.pravatar.cc/150?u=anna", name: "Pastel Dream", colors: ["#FFB6B9", "#FAE3D9", "#BBDED6", "#61C0BF", "#FFFFFF"], mood: "dreamy" },
    { id: 6, author: "Tom H.", avatar: "https://i.pravatar.cc/150?u=tom", name: "Monochrome Dark", colors: ["#121212", "#1E1E1E", "#2C2C2C", "#3D3D3D", "#4F4F4F"], mood: "minimalist" },
    { id: 7, author: "Sofia V.", avatar: "https://i.pravatar.cc/150?u=sofia", name: "Ocean Breeze", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#FFFFFF"], mood: "calm" },
    { id: 8, author: "Lucas M.", avatar: "https://i.pravatar.cc/150?u=lucas", name: "Retro Coffee", colors: ["#483C32", "#966F33", "#C5A059", "#EAD8C0", "#F4F4F0"], mood: "warm" },
    { id: 9, author: "Clara S.", avatar: "https://i.pravatar.cc/150?u=clara", name: "Lavender Fields", colors: ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#BA55D3", "#9932CC"], mood: "dreamy" },
    { id: 10, author: "Roberto G.", avatar: "https://i.pravatar.cc/150?u=robert", name: "Deep Space", colors: ["#0B0E14", "#1B212C", "#2D3748", "#4A5568", "#A0AEC0"], mood: "minimalist" },
    { id: 11, author: "Marta P.", avatar: "https://i.pravatar.cc/150?u=marta", name: "Tropic Thunder", colors: ["#FFD700", "#FF8C00", "#FF4500", "#DC143C", "#8B0000"], mood: "energetic" },
    { id: 12, author: "Iñaki U.", avatar: "https://i.pravatar.cc/150?u=inaki", name: "Nordic Winter", colors: ["#F0F8FF", "#E6E6FA", "#B0C4DE", "#778899", "#2F4F4F"], mood: "calm" },
    { id: 13, author: "Javier M.", avatar: "https://i.pravatar.cc/150?u=javier", name: "Golden Hour", colors: ["#FFF700", "#FFD300", "#FFAA00", "#FF8000", "#FF5500"], mood: "warm" },
    { id: 14, author: "Laura B.", avatar: "https://i.pravatar.cc/150?u=laura", name: "Soft Charcoal", colors: ["#36454F", "#536872", "#708090", "#778899", "#D3D3D3"], mood: "minimalist" },
    { id: 15, author: "Oscar F.", avatar: "https://i.pravatar.cc/150?u=oscar", name: "Matcha Tea", colors: ["#D0F0C0", "#ACE1AF", "#8FBC8F", "#3CB371", "#2E8B57"], mood: "calm" },
    { id: 16, author: "Carmen H.", avatar: "https://i.pravatar.cc/150?u=carmen", name: "Flamenco Red", colors: ["#800000", "#B22222", "#FF0000", "#FF6347", "#FF7F50"], mood: "energetic" },
];

export default function PalettePreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { savePalette } = useAura();
    const palette = communityPalettes.find(p => p.id === Number(id)) || communityPalettes[0];
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const handleRemix = () => {
        navigate("/brandkit", { state: { colors: palette.colors, name: palette.name } });
    };

    const handleCopy = async () => {
        try {
            await savePalette({
                name: `${palette.name} (Copy)`,
                colors: palette.colors.map((hex: string, i: number) => ({ hex, name: `Color ${i + 1}` }))
            });
            alert(`¡Paleta "${palette.name}" copiada a tus proyectos! ✨`);
        } catch (err) {
            alert("Debes iniciar sesión para guardar paletas.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50/50">
            {/* Top Bar */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
                <Link to="/community" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-medium text-sm">Back to Community</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRemix}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                    >
                        <Zap size={14} /> Remix
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        <Copy size={14} /> Copiar
                    </button>
                    <div className="w-px h-6 bg-gray-100 mx-1" />
                    <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors" title="Export">
                        <Download size={18} />
                    </button>
                    <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col gap-12">
                {/* Header & Palette */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src={palette.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt={palette.author} />
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold tracking-tight">{palette.name}</h1>
                                <p className="text-gray-500">by {palette.author}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex h-16 w-full md:w-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
                        {palette.colors.map((color, idx) => (
                            <button
                                key={idx}
                                onClick={() => copyToClipboard(color)}
                                className="flex-1 h-full relative group flex items-center justify-center"
                                style={{ backgroundColor: color }}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white uppercase tracking-tighter transition-opacity drop-shadow-md">
                                    {copiedColor === color ? <Check size={14} /> : color}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visual Showcase Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Dashboard Mockup (Main Span) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <LayoutIcon size={18} style={{ color: palette.colors[1] }} />
                                    Dashboard Application
                                </h3>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.colors[0] }} />
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.colors[1] }} />
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.colors[2] }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Active Revenue", value: "$12,450", icon: <PieChart size={20} /> },
                                    { label: "New Users", value: "+ 540", icon: <Smartphone size={20} /> },
                                    { label: "Conversion", value: "8.4%", icon: <CreditCard size={20} /> }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 rounded-2xl border border-gray-50 bg-gray-50/30 flex flex-col gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: palette.colors[i % 5], color: '#fff' }}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-xl font-bold">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 w-full h-[300px] rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-50">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: palette.colors[0] }} />
                                <div className="relative w-full h-full p-8 flex flex-col justify-end">
                                    <div className="h-full w-full flex items-end gap-2">
                                        {[65, 45, 75, 55, 85, 95, 45, 65, 85].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                className="flex-1 rounded-t-lg"
                                                style={{ backgroundColor: palette.colors[i % 5] }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile UI & Components */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        {/* Mobile Viewport */}
                        <div className="relative w-full aspect-[4/5] bg-black rounded-[48px] p-4 shadow-2xl overflow-hidden border-4 border-gray-800">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-2xl z-10" />
                            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col">
                                <div className="p-6 flex flex-col gap-6">
                                    <div className="h-32 rounded-2xl p-4 flex flex-col justify-end gap-2" style={{ background: `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[1]})` }}>
                                        <h4 className="text-white font-bold text-lg">Morning J.</h4>
                                        <div className="h-1 w-1/2 bg-white/30 rounded-full" />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: palette.colors[i % 5] }} />
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
                                                    <div className="h-2 w-1/2 bg-gray-50 rounded-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-auto p-4 flex justify-between items-center border-t border-gray-50">
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.colors[0] }} />
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.colors[1] }} />
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.colors[2] }} />
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.colors[3] }} />
                                </div>
                            </div>
                        </div>

                        {/* Typography Preview */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Typography</h4>
                            <div className="flex flex-col gap-4">
                                <h1 className="text-4xl font-bold" style={{ color: palette.colors[3] }}>Headings</h1>
                                <p className="text-base" style={{ color: palette.colors[3] }}>
                                    A visual display of how your selected palette communicates through text hierarchy.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {palette.colors.map((c, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50" style={{ color: c }}>
                                            Sample Tag
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
