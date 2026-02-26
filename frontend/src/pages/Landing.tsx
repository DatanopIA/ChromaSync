import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Globe, MousePointer2, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";

export default function Landing() {
    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden">
            <SEO
                title="ChromaSync Aura | El Futuro del Color con IA"
                description="La plataforma definitiva para diseñadores y creativos. Genera paletas de colores inteligentes basadas en la psicología y tendencias globales."
            />

            {/* Hero Section with Aurora */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <AuroraBackground
                    className="absolute inset-0 z-0"
                    showRadialGradient={true}
                >
                    <div className="sr-only">Fondo Aurora Animado</div>
                </AuroraBackground>

                <div className="relative z-10 max-w-[1200px] px-6 text-center flex flex-col items-center gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-4"
                    >
                        <Logo size={120} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                            EL COLOR DE TU AURA,<br />
                            <span className="text-cyan-400">SINCRONIZADO POR IA</span>
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-2xl max-w-2xl mx-auto font-medium">
                            Transforma emociones, imágenes y conceptos en sistemas de color profesionales con el motor de IA más avanzado del mundo.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col md:flex-row gap-4 mt-8"
                    >
                        <Link
                            to="/generator"
                            className="group relative px-10 py-5 bg-foreground text-background rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10 flex items-center gap-2">
                                Comenzar Ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            to="/community"
                            className="px-10 py-5 bg-background border border-border rounded-full font-bold text-lg hover:bg-muted transition-colors"
                        >
                            Explorar Comunidad
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-12 flex flex-col items-center gap-2 text-muted-foreground"
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.3em]">Desliza para descubrir</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-background border-y border-border overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: "Paletas creadas", val: "2.4M+" },
                        { label: "Usuarios activos", val: "150k+" },
                        { label: "Precisión IA", val: "99.2%" },
                        { label: "Países", val: "120+" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-1"
                        >
                            <span className="text-3xl md:text-5xl font-black">{stat.val}</span>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Marquee Section */}
            <div className="py-6 bg-cyan-400 overflow-hidden whitespace-nowrap flex border-y border-black">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex gap-20 items-center px-10"
                >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-black font-black text-2xl uppercase italic tracking-tighter">Powered by Google Gemini</span>
                            <Sparkles className="text-black" size={24} />
                            <span className="text-black font-black text-2xl uppercase italic tracking-tighter">Unlimited Creativity</span>
                            <Zap className="text-black" size={24} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Features - Dynamic Grid */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-sm">Tecnología de Vanguardia</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">DISEÑADO PARA<br />LA NUEVA ERA</h2>
                        </div>
                        <p className="max-w-md text-muted-foreground text-lg leading-relaxed">
                            No es solo un generador. Es un ecosistema completo para construir identidades visuales coherentes de forma instantánea.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="text-cyan-400" />}
                            title="Generación en Milisegundos"
                            description="Basado en Google Gemini Pro, entiende el contexto emocional de tu marca."
                        />
                        <FeatureCard
                            icon={<Palette className="text-pink-500" />}
                            title="Psicología del Color"
                            description="Análisis automático de cómo tus colores afectan la percepción del usuario."
                        />
                        <FeatureCard
                            icon={<Globe className="text-blue-500" />}
                            title="Exportación Universal"
                            description="Formatos nativos para Figma, Adobe, CSS, Tailwind y más."
                        />
                    </div>
                </div>
            </section>

            {/* High-Impact Visual Section (Interactive Showcase) */}
            <section className="py-20 px-4">
                <div className="max-w-[1400px] mx-auto rounded-[3rem] overflow-hidden relative shadow-2xl border border-border bg-neutral-950 flex flex-col md:flex-row items-center">
                    <div className="flex-1 p-12 md:p-20 flex flex-col gap-8">
                        <span className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-sm">Tu Marca, Tu Aura</span>
                        <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">LA IA QUE<br /><span className="text-muted-foreground">SINTETIZA</span><br />TUS IDEAS</h3>
                        <p className="text-white/60 text-lg max-w-sm">No piques piedra buscando el color perfecto. Deja que nuestra red neuronal lo encuentre por ti.</p>
                        <div>
                            <Link to="/generator" className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-cyan-400 pb-1 hover:text-cyan-400 transition-colors">
                                Pruebalo ahora <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[500px] md:h-auto self-stretch relative overflow-hidden flex">
                        {[
                            ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#fff7ed"],
                            ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#f0f9ff"],
                            ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"],
                            ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#ecfdf5"]
                        ].map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 1, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 8,
                                    delay: i * 2,
                                    times: [0, 0.1, 0.9, 1]
                                }}
                                className="absolute inset-0 flex"
                            >
                                {p.map((c, j) => (
                                    <div key={j} className="flex-1 h-full" style={{ backgroundColor: c }} />
                                ))}
                            </motion.div>
                        ))}
                        <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-neutral-950 to-transparent">
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-xs font-bold uppercase tracking-widest">Optimización Dinámica</span>
                                    <span className="text-white/50 text-[10px]">Ajustando contrastes para legibilidad AA...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 px-6 text-center bg-foreground text-background relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-10">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter">¿LISTO PARA LLEVAR TU DISEÑO AL SIGUIENTE NIVEL?</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <Link
                            to="/generator"
                            className="px-12 py-6 bg-background text-foreground rounded-full font-bold text-xl hover:scale-105 transition-transform"
                        >
                            Empezar Gratis
                        </Link>
                        <Link
                            to="/pricing"
                            className="px-12 py-6 border border-background/20 rounded-full font-bold text-xl hover:bg-background/10 transition-colors"
                        >
                            Ver Planes Pro
                        </Link>
                    </div>
                    <p className="text-background/40 text-sm font-medium">No se requiere tarjeta de crédito para empezar.</p>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="p-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-sm flex flex-col gap-6"
        >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                {icon}
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}
