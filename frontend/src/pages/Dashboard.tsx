import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Image, Eye, Download, Briefcase, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MagneticText } from "@/components/ui/morphing-cursor";
import { AuroraBackground } from "@/components/ui/aurora-background";

const categories = [
  {
    id: "trending",
    name: "Trending",
    description: "Paletas dinámicas que capturan el pulso visual del momento.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=1000",
    palette: ["#121212", "#3D2C8D", "#916BBF", "#C996CC", "#FFD6FF"],
    accent: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "La elegancia de lo esencial a través de tonos neutros y equilibrio.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800&h=1000",
    palette: ["#F9F9F9", "#EAEAEA", "#D4D4D4", "#A3A3A3", "#525252"],
    accent: "from-gray-300/20 to-gray-400/20"
  },
  {
    id: "darkmode",
    name: "Dark Mode",
    description: "Contrastes profundos optimizados para interfaces modernas y nocturnas.",
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800&h=1000",
    palette: ["#020617", "#0F172A", "#1E293B", "#334155", "#94A3B8"],
    accent: "from-slate-900/40 to-slate-800/40"
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Explosiones cromáticas diseñadas para destacar y energizar.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800&h=1000",
    palette: ["#FF00FF", "#00D2FF", "#9D00FF", "#FFD700", "#121212"],
    accent: "from-fuchsia-500/20 to-cyan-500/20"
  }
];

const recentPalettes = [
  { id: 1, name: "Cyberpunk Neon", colors: ["#FF003C", "#00E5FF", "#FCEE0A", "#1A1A1A", "#FFFFFF"] },
  { id: 2, name: "Soft Minimal", colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD"] },
  { id: 3, name: "Earthy Tones", colors: ["#8B5A2B", "#CD853F", "#DEB887", "#F5DEB3", "#FFF8DC"] },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24"
    >
      {/* Hero Section */}
      <section className="flex flex-col gap-8 relative">
        {/* Mobile Aurora Background - Specifically for Hero Section */}
        <div className="md:hidden absolute -inset-x-6 -top-32 bottom-0 -z-10 pointer-events-none overflow-hidden opacity-50">
          <AuroraBackground className="h-full w-full bg-transparent dark:bg-transparent" showRadialGradient={true}>
            <span className="sr-only">Hero Background Aurora</span>
          </AuroraBackground>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col md:flex-row md:items-center gap-2 md:gap-8 overflow-visible"
        >
          {/* Desktop Version with Magnetic Animation */}
          <div className="hidden md:flex items-center gap-8">
            <MagneticText
              text="COLOR"
              hoverText="CREATE"
              className="md:text-[8vw] font-black tracking-tighter uppercase leading-[0.8]"
              circleSize={200}
            />
            <MagneticText
              text="STUDIO"
              hoverText="DESIGN"
              className="md:text-[8vw] font-black tracking-tighter uppercase leading-[0.8]"
              circleSize={200}
            />
          </div>

          {/* Mobile Version - Clean Static Typography (No dots) */}
          <div className="flex md:hidden flex-col gap-[2px] mb-4">
            <h1 className="text-[20vw] font-black tracking-tighter uppercase leading-[0.75] text-foreground">
              COLOR
            </h1>
            <h1 className="text-[20vw] font-black tracking-tighter uppercase leading-[0.75] text-foreground">
              STUDIO
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-2xl md:text-4xl font-medium leading-tight md:h-auto">
              {activeCategory.description}
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Premium color palettes carefully designed and refined for fashion, lifestyle, and high-end digital experiences worldwide.
            </p>

            <div className="flex flex-col gap-4 mt-8">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-2">Categories</h3>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between py-4 border-b border-border group cursor-pointer transition-all duration-300 ${activeCategory.id === cat.id ? 'pl-4 border-foreground bg-muted/20' : 'hover:pl-2'}`}
                >
                  <div className="flex items-center gap-4">
                    {activeCategory.id === cat.id && (
                      <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    )}
                    <span className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 ${activeCategory.id === cat.id ? 'text-foreground font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {cat.name} /
                    </span>
                  </div>
                  <ArrowRight size={16} className={`transition-all duration-300 ${activeCategory.id === cat.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dynamic Image Display */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={activeCategory.image}
                  alt={activeCategory.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${activeCategory.accent} mix-blend-overlay opacity-50`} />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 glass-dark rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-6 backdrop-blur-2xl border border-white/10 overflow-hidden">
              {/* Floating shine effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              />

              <div className="flex h-14 w-full rounded-xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="popLayout">
                  {activeCategory.palette.map((color, i) => (
                    <motion.div
                      key={`${activeCategory.id}-${i}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-1 h-full hover:flex-[1.5] transition-all duration-300 cursor-help relative group/color"
                      style={{ backgroundColor: color }}
                    >
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap drop-shadow-md">
                        {color}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex justify-between items-center text-white relative z-10 gap-2">
                <div className="flex flex-col">
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Concept Studio</span>
                  <span className="font-medium text-base md:text-lg">{activeCategory.name} Vision</span>
                </div>
                <button
                  onClick={() => navigate("/brandkit", { state: { colors: activeCategory.palette, name: activeCategory.name } })}
                  className="text-[10px] md:text-xs bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
                >
                  Remixear
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="flex flex-col gap-12 pt-12 relative overflow-visible">
        <div className="flex flex-col gap-4">
          <h2 className="text-[18vw] md:text-[12vw] leading-[0.8] font-black tracking-tighter uppercase opacity-[0.03] dark:opacity-[0.05] select-none absolute -top-12 md:-top-20 -left-6 md:-left-12 pointer-events-none z-0 text-foreground">TOOLS</h2>
          <h3 className="text-3xl md:text-4xl font-medium relative z-10">Herramientas Creativas</h3>
          <p className="text-muted-foreground text-lg max-w-xl">
            Todo lo que necesitas para perfeccionar tu identidad visual, desde IA generativa hasta análisis de contraste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Generador IA",
              desc: "Crea esquemas de color únicos mediante lenguaje natural e inteligencia artificial.",
              icon: <Sparkles className="w-6 h-6" />,
              accent: "from-purple-500/20 to-blue-500/20",
              link: "/generator"
            },
            {
              title: "Extractor de Imagen",
              desc: "Extrae la esencia cromática de cualquier fotografía de forma instantánea.",
              icon: <Image className="w-6 h-6" />,
              accent: "from-orange-500/20 to-red-500/20",
              link: "/generator"
            },
            {
              title: "Comprobador de Contraste",
              desc: "Asegura la legibilidad de tus diseños verificando el contraste en tiempo real.",
              icon: <Eye className="w-6 h-6" />,
              accent: "from-green-500/20 to-emerald-500/20",
              link: "/projects"
            },
            {
              title: "Kit de Marca",
              desc: "Organiza tus recursos visuales y mantén la consistencia en todos tus proyectos.",
              icon: <Briefcase className="w-6 h-6" />,
              accent: "from-blue-500/20 to-indigo-500/20",
              link: "/brandkit"
            },
            {
              title: "Exportación Universal",
              desc: "Descarga tus paletas en formatos listos para producción como ASE, CSS o PDF.",
              icon: <Download className="w-6 h-6" />,
              accent: "from-pink-500/20 to-rose-500/20",
              link: "/projects"
            },
            {
              title: "Explorador Global",
              desc: "Descubre tendencias y remixea paletas creadas por nuestra comunidad global.",
              icon: <Globe className="w-6 h-6" />,
              accent: "from-cyan-500/20 to-teal-500/20",
              link: "/community"
            }
          ].map((tool, index) => (
            <Link key={tool.title} to={tool.link}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative h-full p-8 rounded-[2rem] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all cursor-pointer overflow-hidden"
              >
                {/* Accent Glow */}
                <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${tool.accent} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col h-full items-start">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-4 rounded-2xl bg-background border border-border text-foreground mb-8 group-hover:shadow-lg transition-all"
                  >
                    {tool.icon}
                  </motion.div>

                  <h4 className="text-xl font-medium mb-3 group-hover:text-foreground transition-colors">{tool.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                    {tool.desc}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-foreground">
                    Explorar ahora <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="flex flex-col gap-12">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <h2 className="text-3xl font-medium">Recent Palettes</h2>
          <Link to="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPalettes.map((palette, index) => (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              onClick={() => navigate("/brandkit", { state: { colors: palette.colors, name: palette.name } })}
              className="group cursor-pointer flex flex-col gap-4"
            >
              <div className="flex h-32 w-full rounded-xl overflow-hidden shadow-sm border border-border/50 relative">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.5]"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">Remixear</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <h3 className="font-medium text-lg">{palette.name}</h3>
                <span className="text-sm text-muted-foreground">{palette.colors.length} colores</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-[4rem] bg-foreground text-background mb-12 shadow-2xl min-h-[500px] flex items-center justify-center">
        {/* Desktop Layout - Keep static backgrounds & Magnetic Text */}
        <div className="hidden md:block absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"
          />
        </div>

        {/* Mobile Layout - Aurora Background */}
        <div className="md:hidden absolute inset-0">
          <AuroraBackground className="h-full w-full opacity-80 bg-transparent dark:bg-transparent">
            <span className="sr-only">Aurora Background</span>
          </AuroraBackground>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-10 w-full py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 items-center w-full"
          >
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">Next Generation Color Tool</span>

            {/* Conditional Rendering for Text Style */}
            <div className="hidden md:block w-full">
              <MagneticText
                text="CREA TU IDENTIDAD VISUAL"
                hoverText="DISEÑA TU FUTURO DIGITAL"
                className="text-5xl lg:text-7xl font-medium tracking-tight text-center max-w-4xl px-4"
                variant="inverted"
                circleSize={300}
              />
            </div>
            <div className="md:hidden block">
              <h2 className="text-4xl font-bold tracking-tighter leading-tight px-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                CREA TU IDENTIDAD VISUAL
              </h2>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-base md:text-2xl max-w-3xl leading-relaxed font-light"
          >
            Accede a generación ilimitada por IA, exportación en alta resolución y herramientas exclusivas diseñadas para elevar tu flujo de trabajo al estándar de la industria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="pt-4"
          >
            <Link
              to="/pricing"
              className="group relative inline-flex items-center gap-4 md:gap-6 bg-white text-black px-8 md:px-16 py-6 md:py-8 rounded-full font-bold uppercase tracking-[0.2em] text-xs md:text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
            >
              Comenzar ahora
              <ArrowRight className="group-hover:translate-x-3 transition-transform duration-300" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
