import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter, Heart, MessageSquare, Share2, TrendingUp, Award, Sparkles, X, ChevronDown, Palette, Smile, Zap, Coffee, Moon, Sun, Cloud, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const communityPalettes = [
  { id: 1, author: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah", name: "Neon Nights", colors: ["#FF003C", "#00E5FF", "#FCEE0A", "#1A1A1A", "#FFFFFF"], likes: 1205, comments: 45, isTrending: true, mood: "energetic", category: "neon" },
  { id: 2, author: "Mike T.", avatar: "https://i.pravatar.cc/150?u=mike", name: "Forest Calm", colors: ["#2C5F2D", "#97BC62", "#D4E09B", "#F6F4D2", "#CBDFBD"], likes: 842, comments: 12, isTrending: false, mood: "calm", category: "nature" },
  { id: 3, author: "Elena R.", avatar: "https://i.pravatar.cc/150?u=elena", name: "Sunset Vibes", colors: ["#FF7B54", "#FFB26B", "#FFD56F", "#939B62", "#F4F4F0"], likes: 2341, comments: 89, isTrending: true, mood: "warm", category: "gradient" },
  { id: 4, author: "David L.", avatar: "https://i.pravatar.cc/150?u=david", name: "Cyberpunk 2077", colors: ["#FCEE0A", "#00E5FF", "#FF003C", "#1A1A1A", "#000000"], likes: 567, comments: 23, isTrending: false, mood: "energetic", category: "neon" },
  { id: 5, author: "Anna K.", avatar: "https://i.pravatar.cc/150?u=anna", name: "Pastel Dream", colors: ["#FFB6B9", "#FAE3D9", "#BBDED6", "#61C0BF", "#FFFFFF"], likes: 1890, comments: 67, isTrending: true, mood: "dreamy", category: "pastel" },
  { id: 6, author: "Tom H.", avatar: "https://i.pravatar.cc/150?u=tom", name: "Monochrome Dark", colors: ["#121212", "#1E1E1E", "#2C2C2C", "#3D3D3D", "#4F4F4F"], likes: 432, comments: 8, isTrending: false, mood: "minimalist", category: "monochrome" },
  { id: 7, author: "Sofia V.", avatar: "https://i.pravatar.cc/150?u=sofia", name: "Ocean Breeze", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#FFFFFF"], likes: 1560, comments: 34, isTrending: true, mood: "calm", category: "nature" },
  { id: 8, author: "Lucas M.", avatar: "https://i.pravatar.cc/150?u=lucas", name: "Retro Coffee", colors: ["#483C32", "#966F33", "#C5A059", "#EAD8C0", "#F4F4F0"], likes: 920, comments: 21, isTrending: false, mood: "warm", category: "vintage" },
  { id: 9, author: "Clara S.", avatar: "https://i.pravatar.cc/150?u=clara", name: "Lavender Fields", colors: ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#BA55D3", "#9932CC"], likes: 750, comments: 15, isTrending: false, mood: "dreamy", category: "pastel" },
  { id: 10, author: "Roberto G.", avatar: "https://i.pravatar.cc/150?u=robert", name: "Deep Space", colors: ["#0B0E14", "#1B212C", "#2D3748", "#4A5568", "#A0AEC0"], likes: 1100, comments: 28, isTrending: true, mood: "minimalist", category: "monochrome" },
  { id: 11, author: "Marta P.", avatar: "https://i.pravatar.cc/150?u=marta", name: "Tropic Thunder", colors: ["#FFD700", "#FF8C00", "#FF4500", "#DC143C", "#8B0000"], likes: 620, comments: 10, isTrending: false, mood: "energetic", category: "gradient" },
  { id: 12, author: "Iñaki U.", avatar: "https://i.pravatar.cc/150?u=inaki", name: "Nordic Winter", colors: ["#F0F8FF", "#E6E6FA", "#B0C4DE", "#778899", "#2F4F4F"], likes: 2100, comments: 54, isTrending: true, mood: "calm", category: "nature" },
  { id: 13, author: "Javier M.", avatar: "https://i.pravatar.cc/150?u=javier", name: "Golden Hour", colors: ["#FFF700", "#FFD300", "#FFAA00", "#FF8000", "#FF5500"], likes: 1450, comments: 31, isTrending: false, mood: "warm", category: "gradient" },
  { id: 14, author: "Laura B.", avatar: "https://i.pravatar.cc/150?u=laura", name: "Soft Charcoal", colors: ["#36454F", "#536872", "#708090", "#778899", "#D3D3D3"], likes: 580, comments: 14, isTrending: false, mood: "minimalist", category: "monochrome" },
  { id: 15, author: "Oscar F.", avatar: "https://i.pravatar.cc/150?u=oscar", name: "Matcha Tea", colors: ["#D0F0C0", "#ACE1AF", "#8FBC8F", "#3CB371", "#2E8B57"], likes: 890, comments: 19, isTrending: true, mood: "calm", category: "nature" },
  { id: 16, author: "Carmen H.", avatar: "https://i.pravatar.cc/150?u=carmen", name: "Flamenco Red", colors: ["#800000", "#B22222", "#FF0000", "#FF6347", "#FF7F50"], likes: 1230, comments: 42, isTrending: true, mood: "energetic", category: "gradient" },
];

const MODES = [
  { id: "all", label: "All Sensations", icon: <Sparkles size={16} /> },
  { id: "energetic", label: "Energetic", icon: <Zap size={16} /> },
  { id: "calm", label: "Calm", icon: <Cloud size={16} /> },
  { id: "warm", label: "Warm & Cozy", icon: <Sun size={16} /> },
  { id: "dreamy", label: "Dreamy", icon: <Moon size={16} /> },
  { id: "minimalist", label: "Minimalist", icon: <Coffee size={16} /> },
];

const CATEGORIES = [
  { id: "all", label: "All Styles" },
  { id: "neon", label: "Neon" },
  { id: "gradient", label: "Gradients" },
  { id: "pastel", label: "Pastels" },
  { id: "monochrome", label: "Monochrome" },
  { id: "nature", label: "Nature" },
];

import { useNavigate } from "react-router-dom";
import { useAura } from "../context/AuraContext";

export default function Community() {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { savePalette } = useAura();

  const handleRemix = (palette: any) => {
    navigate("/brandkit", { state: { colors: palette.colors, name: palette.name } });
  };

  const handleCopy = async (palette: any) => {
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPalettes = useMemo(() => {
    return communityPalettes.filter((palette) => {
      const matchesTab = activeTab === "trending" ? palette.isTrending : true;
      const matchesSearch =
        palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        palette.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        palette.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMood = selectedMood === "all" || palette.mood === selectedMood;
      const matchesCategory = selectedCategory === "all" || palette.category === selectedCategory;

      return matchesTab && matchesSearch && matchesMood && matchesCategory;
    });
  }, [activeTab, searchQuery, selectedMood, selectedCategory]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-medium tracking-tight flex items-center gap-3"
          >
            Community
          </motion.h1>
          <p className="text-gray-500 text-lg">Discover and get inspired by palettes from creators worldwide.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search palettes, tags, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label="Filter options"
              title="Filter options"
              className={`p-3 rounded-full transition-all flex items-center gap-2 ${isFilterOpen || selectedMood !== "all" || selectedCategory !== "all" ? "bg-black text-white px-5" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
            >
              <Filter size={18} />
              {(selectedMood !== "all" || selectedCategory !== "all") && (
                <span className="text-xs font-medium">Active</span>
              )}
              {isFilterOpen ? <ChevronDown size={14} className="rotate-180 transition-transform" /> : <ChevronDown size={14} className="transition-transform" />}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Sensations</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {MODES.map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() => setSelectedMood(mood.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${selectedMood === mood.id ? "bg-black text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                        >
                          {mood.icon} {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Styles</h4>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat.id ? "bg-black text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(selectedMood !== "all" || selectedCategory !== "all") && (
                    <button
                      onClick={() => { setSelectedMood("all"); setSelectedCategory("all"); }}
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors text-center pt-2 border-t border-gray-50"
                    >
                      Reset all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-6 border-b border-gray-100 pb-4">
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex items-center gap-2 pb-4 -mb-4 font-medium transition-all relative ${activeTab === "trending" ? "text-black" : "text-gray-500 hover:text-black"}`}
        >
          <TrendingUp size={18} /> Trending
          {activeTab === "trending" && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`flex items-center gap-2 pb-4 -mb-4 font-medium transition-all relative ${activeTab === "new" ? "text-black" : "text-gray-500 hover:text-black"}`}
        >
          <Award size={18} /> New & Noteworthy
          {activeTab === "new" && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredPalettes.length > 0 ? (
            filteredPalettes.map((palette) => (
              <motion.div
                key={palette.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col gap-4 cursor-pointer"
                onClick={() => navigate(`/community/${palette.id}`)}
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <img src={palette.avatar} alt={palette.author} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div className="flex flex-col">
                      <h4 className="font-medium text-sm">{palette.author}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {palette.isTrending && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm flex items-center gap-1">
                        <TrendingUp size={10} /> Hot
                      </span>
                    )}
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                      {palette.mood}
                    </span>
                  </div>
                </div>

                <div className="flex h-48 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group-hover:shadow-xl transition-all duration-300 relative">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.1]"
                      style={{ backgroundColor: color }}
                    />
                  ))}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemix(palette); }}
                      className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Zap size={14} /> Remix
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(palette); }}
                      className="px-4 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/30 transition-all flex items-center gap-2"
                    >
                      <Copy size={14} /> Copiar
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <h3 className="font-medium text-lg text-gray-800">{palette.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        aria-label="Like palette"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium"
                      >
                        <Heart size={16} /> {palette.likes}
                      </button>
                      <button
                        aria-label="View comments"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors text-sm font-medium"
                      >
                        <MessageSquare size={16} /> {palette.comments}
                      </button>
                    </div>
                    <button
                      aria-label="Share palette"
                      onClick={(e) => e.stopPropagation()}
                      title="Share palette"
                      className="text-gray-300 hover:text-black transition-colors"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center flex flex-col items-center gap-4"
            >
              <div className="p-6 bg-gray-50 rounded-full text-gray-300">
                <Palette size={48} />
              </div>
              <div>
                <p className="text-gray-500 text-lg font-medium">No palettes found matching your criteria.</p>
                <p className="text-gray-400 text-sm">Try combining other sensations or styles.</p>
              </div>
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("new"); setSelectedMood("all"); setSelectedCategory("all"); }}
                className="mt-4 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition-all shadow-lg shadow-black/10"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
