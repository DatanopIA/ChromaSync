import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const integrations = [
    { name: "Google AI", category: "Intelligence", color: "from-blue-400 to-red-400" },
    { name: "Supabase", category: "Infrastructure", color: "from-emerald-400 to-emerald-600" },
    { name: "Stripe", category: "Payments", color: "from-indigo-400 to-purple-500" },
    { name: "Figma", category: "Design", color: "from-orange-400 to-pink-500" },
    { name: "Adobe CC", category: "Creative", color: "from-red-500 to-red-600" },
];

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border mt-24">
            <div className="max-w-[1400px] mx-auto px-6 py-20 flex flex-col gap-20">
                {/* Integrations Section */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Integraciones</h3>
                        <p className="text-2xl font-medium tracking-tight">Conectado con tu ecosistema creativo</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {integrations.map((item) => (
                            <motion.div
                                key={item.name}
                                whileHover={{ y: -5 }}
                                className="group relative p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-border transition-all flex flex-col gap-6 overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.category}</span>
                                    <span className="text-lg font-bold">{item.name}</span>
                                </div>
                                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1 duration-300">
                                    Conectado <ArrowUpRight size={12} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <Logo size={40} className="group-hover:rotate-6 transition-transform duration-500" />
                            <span className="font-bold text-xl tracking-tight">ChromaSync</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            La plataforma definitiva para profesionales del diseño que buscan dominar el color con precisión algorítmica y creatividad humana.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Producto</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/generator" className="text-muted-foreground hover:text-foreground transition-colors">Generador IA</Link></li>
                            <li><Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors">Explorador</Link></li>
                            <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Planes</Link></li>
                            <li><Link to="/brandkit" className="text-muted-foreground hover:text-foreground transition-colors">Brand Kit</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Empresa</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">Sobre nosotros</Link></li>
                            <li><a href="mailto:info@artbymaeki.com?subject=ChromaSync usuario" className="text-muted-foreground hover:text-foreground transition-colors">Contacto</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Newsletter</h4>
                        <p className="text-muted-foreground text-sm">Recibe las últimas tendencias en color y diseño en tu bandeja de entrada.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-muted/50 border border-border rounded-full px-6 py-4 pr-12 focus:outline-none focus:border-foreground transition-colors text-sm"
                            />
                            <button
                                type="submit"
                                aria-label="Suscribirse"
                                className="absolute right-2 top-2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <ArrowUpRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-sm text-muted-foreground font-medium">
                        © 2026 ChromaSync Aura. Hecho con pasión por el color por DatanopIA.
                    </span>
                    <div className="flex items-center gap-8 text-sm text-muted-foreground">
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors">Términos</Link>
                        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
