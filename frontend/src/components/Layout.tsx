import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, User as UserIcon, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAura } from "../context/AuraContext";
import NotificationBell from "./NotificationBell";
import Footer from "./Footer";
import Logo from "./Logo";
import { AuroraBackground } from "./ui/aurora-background";

const navItems = [
  { name: "Panel", path: "/" },
  { name: "Generador", path: "/generator" },
  { name: "Proyectos", path: "/projects" },
  { name: "Comunidad", path: "/community" },
  { name: "Precios", path: "/pricing" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const { user, signInWithGoogle } = useAura();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full bg-background/40 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size={40} className="group-hover:rotate-6 transition-transform duration-500" />
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/70 to-foreground">ChromaSync</span>
          </Link>

          {/* Desktop Nav - Gradient Pill Style */}
          <nav
            className="hidden md:flex items-center p-1.5 bg-muted rounded-full border border-border relative"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isHovered = hoveredPath === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  className={cn(
                    "relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-300 z-10",
                    isActive ? "text-background" : isHovered ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>

                  {/* Hover background */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hover-pill"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gray-200/50 rounded-full -z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Active Background - Gradient Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground rounded-full shadow-lg shadow-black/20"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    >
                      {/* Suble glow effect */}
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <Link to="/settings" className="flex items-center gap-2 group transition-all">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-blue-500 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={user.user_metadata.avatar_url || "https://picsum.photos/seed/avatar/100/100"}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      referrerPolicy="no-referrer"
                      alt="Avatar de usuario"
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors hidden lg:inline">
                    {user.user_metadata.full_name?.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2"
              >
                <LogIn size={16} />
                Acceder
              </button>
            )}
            <Link
              to="/generator"
              className="group relative px-6 py-2.5 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-foreground group-hover:bg-foreground/80 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-background/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <span className="relative z-10 text-background text-xs font-bold uppercase tracking-widest">Crear Proyecto</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 bg-gray-50 rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            title={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-background z-[70] shadow-2xl p-8 flex flex-col gap-12"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xl">Menú</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-gray-50 rounded-full"
                  aria-label="Cerrar menú"
                  title="Cerrar menú"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-3xl font-bold py-2 transition-colors",
                      location.pathname === item.path ? "text-black" : "text-gray-300 hover:text-gray-600"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                {user ? (
                  <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <img src={user.user_metadata.avatar_url} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
                    <div>
                      <div className="font-bold">{user.user_metadata.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </Link>
                ) : (
                  <button onClick={signInWithGoogle} className="w-full bg-gray-100 text-black py-4 rounded-full font-bold flex items-center justify-center gap-2">
                    <LogIn size={20} /> Acceder con Google
                  </button>
                )}
                <Link
                  to="/generator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-black text-white text-center py-4 rounded-full text-lg font-bold shadow-xl shadow-black/10"
                >
                  Crear Proyecto
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}
