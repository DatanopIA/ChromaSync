import React, { useState, useEffect } from "react";
import { Settings2, Download, Sparkles, Lock, Unlock, Copy, X, Type, LayoutTemplate, Plus, SlidersHorizontal, Loader2, RefreshCw, Image as ImageIcon } from "lucide-react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAura } from "../context/AuraContext";

const initialColors = [
  { id: "1", hex: "#FFFFFF", locked: false },
  { id: "2", hex: "#F0F0F0", locked: false },
  { id: "3", hex: "#CCCCCC", locked: false },
  { id: "4", hex: "#888888", locked: false },
  { id: "5", hex: "#111111", locked: true },
];

export default function Generator() {
  const { generatePalette, savePalette, user, signInWithGoogle } = useAura();
  const location = useLocation();
  const navigate = useNavigate();
  const [colors, setColors] = useState(initialColors);
  const [activeTab, setActiveTab] = useState<"colors" | "mockup">("colors");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handle remix/loading from other pages
  useEffect(() => {
    if (location.state?.colors) {
      const incomingColors = location.state.colors.map((hex: string, i: number) => ({
        id: (i + 1).toString() + Math.random().toString(),
        hex,
        locked: false
      }));
      setColors(incomingColors);
      if (location.state.name) setPrompt(location.state.name);
    }
  }, [location.state]);

  const SENSATIONS = [
    { name: "Montaña", icon: "🏔️", prompt: "Un soplo de aire fresco de montaña, verdes terrosos y grises de roca" },
    { name: "Océano", icon: "🌊", prompt: "Azules profundos del océano, aguas turquesas poco profundas y blanco espuma de mar" },
    { name: "Atardecer", icon: "🌇", prompt: "Naranjas cálidos de atardecer, púrpuras profundos y amarillos de la hora dorada" },
    { name: "Cyberpunk", icon: "⚡", prompt: "Rosas neón, azules eléctricos y grises tecnológicos oscuros" },
    { name: "Minimalista", icon: "⚪", prompt: "Blancos suaves, grises sutiles y acentos negros limpios" },
    { name: "Bosque", icon: "🌲", prompt: "Verdes intensos del bosque, marrones madera y grises neblinosos" },
    { name: "Retro", icon: "📼", prompt: "Colores vintage de los 80, naranjas desgastados y fondos crema" },
    { name: "Lujo Silencioso", icon: "💎", prompt: "Paleta de lujo silencioso, beiges cachemira, cremas suaves y acentos azul marino profundo" },
    { name: "Energía Tropical", icon: "🦜", prompt: "Vibras tropicales brillantes, verdes loro, amarillos vibrantes y rosas exóticos" },
    { name: "Primavera Japonesa", icon: "🌸", prompt: "Primavera japonesa, rosas sakura, verdes matcha suaves y tonos de madera clara" },
    { name: "Noche Nórdica", icon: "❄️", prompt: "Noche de invierno escandinava, azules helados, carbones profundos y destellos de fuego cálidos" }
  ];

  const generateRandomHex = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const handleManualGenerate = () => {
    setColors(colors.map(c => c.locked ? c : { ...c, hex: generateRandomHex() }));
  };

  const handleAIGenerate = async (e?: React.FormEvent | string, imageBase64?: string) => {
    if (e && typeof e !== 'string') e.preventDefault();

    const targetPrompt = typeof e === 'string' ? e : (prompt.trim() || (imageBase64 ? "Genera una paleta basada en esta imagen" : ""));
    if (!targetPrompt && !imageBase64) return;

    // Check plan limits (for UX feedback)
    if (user?.plan === 'FREE' && !imageBase64 && prompt.length > 50) {
      alert("Los prompts detallados son una función PLUS. Por favor, simplifica tu búsqueda o actualiza tu plan.");
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generatePalette(targetPrompt, imageBase64);
      const newColors = data.colors.map((c, i) => ({
        id: (i + 1).toString(),
        hex: (colors[i] && colors[i].locked) ? colors[i].hex : c.hex,
        locked: colors[i]?.locked ? true : false,
        name: (colors[i] && colors[i].locked) ? colors[i].name : c.name,
        psychology: c.psychology
      }));

      // If we had more or fewer colors, adjust
      setColors(newColors);
      if (data.name && !prompt) setPrompt(data.name);
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      const errorMsg = error.response?.errors?.[0]?.message || error.message || "Error desconocido";
      alert(`Error al generar la paleta: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const resizeImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // 0.8 quality jpeg is very efficient
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Por favor, selecciona un archivo de imagen.");
      return;
    }

    try {
      setIsGenerating(true);
      const compressedBase64 = await resizeImage(file);
      await handleAIGenerate(undefined, compressedBase64);
    } catch (error) {
      console.error("Image processing failed:", error);
      alert("Error al procesar la imagen.");
      setIsGenerating(false);
    }
  };

  const handleSensationClick = (sensationPrompt: string) => {
    setPrompt(sensationPrompt);
    handleAIGenerate(sensationPrompt);
  };

  const handleSave = async () => {
    if (!user) {
      alert("Necesitas iniciar sesión para guardar paletas.");
      signInWithGoogle();
      return;
    }

    try {
      const result = await savePalette({
        name: prompt || "Nueva Paleta",
        colors: colors.map(c => ({ hex: c.hex, name: c.id }))
      });

      const paletteId = result?.savePalette?.id;
      if (paletteId) {
        navigate(`/projects/${paletteId}`, { state: { colors: colors.map(c => c.hex), name: prompt } });
      } else {
        alert("Paleta guardada ✨");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      if (err.message?.includes("No autorizado") || err.message?.includes("autenticado")) {
        alert("Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.");
        signInWithGoogle();
      } else {
        alert("Hubo un error al guardar la paleta. Por favor, intenta de nuevo.");
      }
    }
  };

  const handleExportPNG = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Draw background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Draw colors
    const colorWidth = width / colors.length;
    colors.forEach((c, i) => {
      ctx.fillStyle = c.hex;
      ctx.fillRect(i * colorWidth, 0, colorWidth, height);

      // Draw hex text
      ctx.fillStyle = getContrastYIQ(c.hex);
      ctx.font = "bold 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c.hex, i * colorWidth + colorWidth / 2, height - 40);
    });

    // Logo overlay
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText("CHROMASYNC AURA", 100, 40);

    const link = document.createElement("a");
    link.download = `palette-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  function getContrastYIQ(hexcolor: string) {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  const toggleLock = (id: string) => {
    setColors(colors.map(c => c.id === id ? { ...c, locked: !c.locked } : c));
  };

  const removeColor = (id: string) => {
    if (colors.length > 2) {
      setColors(colors.filter(c => c.id !== id));
    }
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, { id: Math.random().toString(), hex: generateRandomHex(), locked: false }]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-80px)] w-full bg-muted transition-colors duration-300"
    >
      {/* Top Toolbar */}
      <div className="h-auto md:h-16 bg-background border-b border-border flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 md:py-0 shrink-0 relative z-50 gap-4 md:gap-0">
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn("p-2 transition-colors rounded-full shrink-0", showFilters ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
            aria-label="Ver sensaciones"
            title="Ver sensaciones inteligentes"
          >
            <SlidersHorizontal size={20} />
          </button>
          <div className="h-4 w-px bg-border hidden md:block"></div>

          <div className="relative group flex items-center gap-1 md:gap-2 flex-1 md:flex-none">
            <form onSubmit={(e) => handleAIGenerate(e)} className="flex items-center flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Ej. 'Bosque nevado'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-muted/50 border-none rounded-l-full pl-6 pr-4 py-2 text-sm w-full min-w-[120px] md:w-64 focus:ring-2 focus:ring-foreground/5 outline-none transition-all placeholder:text-muted-foreground text-foreground"
                aria-label="Buscador de sensaciones"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-muted/50 text-gray-400 hover:text-black pr-4 pl-2 py-2 transition-all disabled:opacity-50"
                aria-label="Generar con IA"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className={cn(prompt.trim() ? "text-violet-500" : "")} />}
              </button>
            </form>

            <div className="relative">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 bg-muted/50 text-muted-foreground hover:text-foreground px-3 md:px-4 py-2 rounded-r-full text-sm cursor-pointer transition-all border-l border-border/50 shrink-0"
                title="Generar desde imagen"
              >
                <ImageIcon size={16} className={isGenerating ? "animate-pulse" : ""} />
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Imagen</span>
              </label>
            </div>
          </div>

          <div className="h-4 w-px bg-border hidden md:block ml-2"></div>

          <div className="flex bg-muted/80 rounded-full p-1 border border-border shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => setActiveTab("colors")}
              className={cn("px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all", activeTab === "colors" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Paleta
            </button>
            <button
              onClick={() => setActiveTab("mockup")}
              className={cn("px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all", activeTab === "mockup" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
          <button
            onClick={handleManualGenerate}
            className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-muted"
            aria-label="Generación aleatoria"
            title="Generación aleatoria"
          >
            <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Aleatorio</span>
          </button>
          <button
            onClick={handleExportPNG}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-border"
            title="Exportar como PNG"
          >
            <Download size={14} />
            <span className="hidden sm:inline">PNG</span>
          </button>
          <button
            onClick={() => navigate('/brandkit', { state: { colors: colors.map(c => c.hex), name: prompt } })}
            className="flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-violet-100"
            title="Abrir en Brand Kit editor"
          >
            <LayoutTemplate size={14} />
            <span className="hidden sm:inline">Remix</span>
          </button>
          <button
            onClick={handleSave}
            className="group relative px-4 md:px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            Guardar
          </button>
        </div>
      </div>

      <AnimatePresence>
        {user?.plan === 'FREE' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-amber-100 border-b border-amber-200 px-6 py-1.5 flex items-center justify-center gap-2 text-[10px] font-bold text-amber-800 uppercase tracking-widest overflow-hidden"
          >
            <Sparkles size={10} /> Estás usando la versión gratuita. <Link to="/pricing" className="underline hover:text-amber-900 ml-1">Actualiza a Plus para funciones ilimitadas</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sensation Pills Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-background border-b border-border px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth relative z-40"
          >
            {SENSATIONS.map((s) => (
              <button
                key={s.name}
                onClick={() => handleSensationClick(s.prompt)}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all text-sm whitespace-nowrap active:scale-95 disabled:opacity-50 bg-background text-foreground"
              >
                <span>{s.icon}</span>
                <span className="font-medium">{s.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "colors" ? (
          <div className="h-full w-full p-4 md:p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full h-full max-h-[85vh] md:max-h-[70vh] flex flex-col md:flex-row gap-2 md:gap-4 overflow-y-auto no-scrollbar py-4">
              <Reorder.Group
                axis={window.innerWidth < 768 ? "y" : "x"}
                values={colors}
                onReorder={setColors}
                className="flex flex-col md:flex-row flex-1 gap-2 md:gap-4 h-full min-h-[500px] md:min-h-0"
              >
                {colors.map((color) => (
                  <Reorder.Item
                    key={color.id}
                    value={color}
                    className="flex-1 min-h-[80px] md:h-full relative group cursor-grab active:cursor-grabbing rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100/50"
                    style={{ backgroundColor: color.hex }}
                  >
                    {/* Controls Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent">
                      <div className="flex flex-col items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={() => removeColor(color.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-sm"
                          aria-label="Eliminar color"
                          title="Eliminar color"
                        >
                          <X size={16} />
                        </button>

                        <button
                          onClick={() => toggleLock(color.id)}
                          className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:text-black transition-colors shadow-sm"
                          aria-label={color.locked ? "Desbloquear color" : "Bloquear color"}
                          title={color.locked ? "Desbloquear color" : "Bloquear color"}
                        >
                          {color.locked ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>

                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-sm cursor-pointer hover:bg-white transition-colors">
                          <span className="font-medium text-sm tracking-wide">{color.hex}</span>
                        </div>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {colors.length < 8 && (
                <button
                  onClick={addColor}
                  className="h-16 md:h-full w-full md:w-16 rounded-xl md:rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-black hover:border-gray-400 hover:bg-gray-50 transition-all shrink-0"
                  aria-label="Añadir color"
                  title="Añadir color"
                >
                  <Plus size={24} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full w-full p-4 md:p-12 overflow-y-auto flex justify-center">
            {/* Minimalist Mockup Preview */}
            <div
              className="w-full max-w-4xl rounded-2xl md:rounded-3xl p-8 md:p-20 shadow-xl transition-colors duration-500"
              style={{ backgroundColor: colors[0]?.hex || "#fff", color: colors[colors.length - 1]?.hex || "#000" }}
            >
              <nav className="flex justify-between items-center mb-12 md:mb-24">
                <div className="font-semibold text-lg md:text-xl tracking-tight">Studio.</div>
                <div className="hidden sm:flex gap-4 md:gap-8 text-xs md:text-sm font-medium opacity-80">
                  <span>Trabajo</span>
                  <span>Sobre nosotros</span>
                  <span>Contacto</span>
                </div>
              </nav>

              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 md:mb-8">
                  Diseñando el futuro de las experiencias digitales.
                </h1>
                <p className="text-lg md:text-xl mb-8 md:mb-12 opacity-70 max-w-lg leading-relaxed">
                  Somos una agencia creativa enfocada en construir productos elegantes, minimalistas y altamente funcionales.
                </p>

                <div className="flex gap-4">
                  <button
                    className="px-6 md:px-8 py-3 md:py-4 rounded-full font-medium text-xs md:text-sm transition-transform hover:scale-105"
                    style={{ backgroundColor: colors[colors.length - 1]?.hex || "#000", color: colors[0]?.hex || "#fff" }}
                  >
                    Ver Proyectos
                  </button>
                </div>
              </div>

              <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[1, 2].map((idx) => (
                  colors[idx] && (
                    <div
                      key={idx}
                      className="aspect-[4/3] rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden"
                      style={{ backgroundColor: colors[idx].hex }}
                    >
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="relative z-10 font-medium text-lg mix-blend-difference text-white">Proyecto {idx}</div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}
