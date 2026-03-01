import { useState, useEffect } from "react";
import { User as UserIcon, Bell, Shield, CreditCard, Monitor, LogOut, Check, X, Edit3, LogIn, Palette, Sparkles, Zap, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useAura } from "../context/AuraContext";
import { Link } from "react-router-dom";
import DownloadAppButton from "../components/DownloadAppButton";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const { user, signInWithGoogle, signOut, loading, theme, setTheme, updateUserProfile } = useAura();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile({
        full_name: name,
        email: email !== user.email ? email : undefined
      });
      alert("Perfil actualizado correctamente. Si has cambiado el email, revisa tu bandeja de entrada para confirmar.");
    } catch (error: any) {
      alert("Error al actualizar el perfil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-8">
        <div className="flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-medium tracking-tight text-foreground"
          >
            Ajustes
          </motion.h1>
          <p className="text-muted-foreground text-lg">Gestiona tu cuenta, preferencias y facturación.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left rounded-lg ${activeTab === "profile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <UserIcon size={18} /> Perfil
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left rounded-lg ${activeTab === "billing" ? "bg-gray-100 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
          >
            <CreditCard size={18} /> suscripción
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left rounded-lg ${activeTab === "appearance" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <Monitor size={18} /> Apariencia
          </button>
          <button
            onClick={() => setActiveTab("app")}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left rounded-lg ${activeTab === "app" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <Smartphone size={18} /> App Nativa
          </button>

          <div className="mt-8 pt-8 border-t border-border">
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left rounded-lg"
              >
                <LogOut size={18} /> Cerrar Sesión
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black bg-gray-50 hover:bg-gray-100 transition-colors w-full text-left rounded-lg"
              >
                <LogIn size={18} /> Iniciar Sesión con Google
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 max-w-3xl">
          {!user && (
            <div className="bg-muted p-8 rounded-[32px] text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm">
                <UserIcon size={32} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Inicia Sesión</h2>
                <p className="text-gray-500 mt-2">Debes estar identificado para gestionar tus ajustes y paletas.</p>
              </div>
              <button
                onClick={signInWithGoogle}
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <LogIn size={18} /> Acceder con Google
              </button>
            </div>
          )}

          {user && activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <img src={user.user_metadata.avatar_url || "https://picsum.photos/seed/avatar/150/150"} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                  <button
                    aria-label="Editar foto de perfil"
                    title="Editar foto"
                    className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-2xl text-foreground">{user.user_metadata.full_name || user.email}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <span className="inline-block mt-3 bg-foreground text-background text-[10px] font-bold uppercase tracking-[2px] px-4 py-1.5 rounded-full w-fit">Free Member</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-10 border-t border-border">
                <div className="space-y-2">
                  <label htmlFor="username-input" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Nombre de usuario</label>
                  <input
                    id="username-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-muted/50 rounded-2xl border border-transparent focus:border-foreground focus:bg-background focus:outline-none transition-all text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Email vinculado</label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-muted/50 rounded-2xl border border-transparent focus:border-foreground focus:bg-background focus:outline-none transition-all text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-12 border-t border-border">
                <button
                  onClick={() => {
                    setName(user.user_metadata.full_name || "");
                    setEmail(user.email || "");
                  }}
                  className="px-8 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-8 py-3 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-full flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </motion.div>
          )}

          {user && activeTab === "billing" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-background border border-border p-8 rounded-[32px] shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Plan Actual</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-foreground">ChromaSync Free</span>
                    <Link to="/pricing" className="text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all">Mejorar Plan</Link>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Estás utilizando la versión gratuita de Aura. Tienes acceso a 5 paletas de IA al día y funciones básicas de diseño.
                </p>
              </div>

              <div className="bg-muted p-8 rounded-[32px] flex items-center justify-between">
                <div>
                  <h4 className="font-bold">Facturación</h4>
                  <p className="text-sm text-muted-foreground mt-1">Gestiona tus métodos de pago en Stripe.</p>
                </div>
                <button className="bg-background border border-border px-6 py-2.5 rounded-full text-sm font-bold hover:bg-muted transition-all">
                  Abrir Portal
                </button>
              </div>
            </motion.div>
          )}

          {user && activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              {/* Theme Selection */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Theme</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Light Theme */}
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      title="Activar modo claro"
                      className={`aspect-[4/3] rounded-2xl bg-white border-2 p-4 flex flex-col gap-3 shadow-lg relative overflow-hidden group transition-all ${theme === "light" ? "border-foreground ring-2 ring-foreground/5" : "border-border hover:border-foreground/20"}`}
                    >
                      <div className="h-4 w-2/3 bg-gray-100 rounded-lg" />
                      <div className="h-10 w-full bg-white border border-gray-100 rounded-lg shadow-sm" />
                      {theme === "light" && (
                        <div className="mt-auto flex justify-end">
                          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                    <span className={`text-center text-sm ${theme === "light" ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>Light (Default)</span>
                  </div>

                  {/* Dark Theme */}
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setTheme("dark")}
                      title="Activar modo oscuro"
                      className={`aspect-[4/3] rounded-2xl bg-[#121212] border-2 p-4 flex flex-col gap-3 transition-all relative overflow-hidden ${theme === "dark" ? "border-foreground ring-2 ring-foreground/10" : "border-border hover:border-foreground/20"}`}
                    >
                      <div className="h-4 w-2/3 bg-[#1e1e1e] rounded-lg" />
                      <div className="h-10 w-full bg-[#1e1e1e] border border-white/5 rounded-lg shadow-sm" />
                      {theme === "dark" && (
                        <div className="mt-auto flex justify-end">
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <Check size={12} className="text-black" />
                          </div>
                        </div>
                      )}
                    </button>
                    <span className={`text-center text-sm ${theme === "dark" ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>Dark</span>
                  </div>

                  {/* System Theme */}
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setTheme("system")}
                      title="Usar tema del sistema"
                      className={`aspect-[4/3] rounded-2xl bg-[#f0f1f3] border-2 p-4 flex flex-col gap-3 transition-all relative overflow-hidden ${theme === "system" ? "border-border ring-2 ring-border/10" : "border-border hover:border-foreground/20"}`}
                    >
                      <div className="h-4 w-2/3 bg-white/50 rounded-lg" />
                      <div className="h-10 w-full bg-white/50 border border-white rounded-lg shadow-sm" />
                      {theme === "system" && (
                        <div className="mt-auto flex justify-end">
                          <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                    <span className={`text-center text-sm ${theme === "system" ? "font-bold text-black dark:text-white" : "font-medium text-gray-400"}`}>System</span>
                  </div>
                </div>
              </section>

              {/* UI Preferences */}
              <section className="space-y-6 pt-12 border-t border-gray-100">
                <h2 className="text-2xl font-bold tracking-tight">UI Preferences</h2>
                <div className="flex flex-col gap-4">
                  {/* Option 1: Animations */}
                  <div className="p-6 md:p-8 bg-card border border-border rounded-[32px] flex items-center justify-between hover:bg-muted/50 transition-all">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold">Reduce Animations</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Disable hover effects and transitions for better performance.</p>
                    </div>
                    <button
                      onClick={() => setReduceAnimations(!reduceAnimations)}
                      aria-label="Alternar reducción de animaciones"
                      className={`w-12 h-6 rounded-full relative p-1 transition-all border border-border ${reduceAnimations ? "bg-foreground" : "bg-muted"}`}
                    >
                      <motion.div
                        animate={{ x: reduceAnimations ? 24 : 0 }}
                        className="w-4 h-4 rounded-full shadow-sm bg-background border border-border/20"
                      />
                    </button>
                  </div>

                  {/* Option 2: AI Suggestions */}
                  <div className="p-6 md:p-8 bg-card border border-border rounded-[32px] flex items-center justify-between hover:bg-muted/50 transition-all">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold">Show AI Suggestions</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Display AI-generated palettes and tips in the generator.</p>
                    </div>
                    <button
                      onClick={() => setShowAISuggestions(!showAISuggestions)}
                      aria-label="Alternar sugerencias de IA"
                      className={`w-12 h-6 rounded-full relative p-1 transition-all border border-border ${showAISuggestions ? "bg-foreground" : "bg-muted"}`}
                    >
                      <motion.div
                        animate={{ x: showAISuggestions ? 24 : 0 }}
                        className="w-4 h-4 rounded-full shadow-sm bg-background border border-border/20"
                      />
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "app" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <section className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Experiencia Nativa</h2>
                  <p className="text-muted-foreground">Lleva ChromaSync Aura más allá del navegador con nuestras aplicaciones optimizadas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="p-8 bg-muted/30 border border-border rounded-[40px] flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-400/10 blur-3xl rounded-full" />
                    <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                      <Monitor className="text-foreground" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">ChromaSync Desktop</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Mejor rendimiento, notificaciones del sistema y herramientas de exportación directa a software de diseño.
                      </p>
                    </div>
                    <DownloadAppButton variant="primary" className="w-full justify-center py-4" />
                  </div>

                  <div className="p-8 bg-muted/30 border border-border rounded-[40px] flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
                    <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                      <Smartphone className="text-foreground" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Aura Mobile</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Instala Aura en tu dispositivo móvil instantáneamente como una Web App de alto rendimiento. Sin esperas.
                      </p>
                    </div>
                    <DownloadAppButton variant="secondary" className="w-full justify-center py-4" />
                  </div>
                </div>

                <div className="bg-foreground text-background p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-1">
                    <h4 className="font-bold text-lg">¿Eres desarrollador?</h4>
                    <p className="text-xs opacity-60">Usa nuestra CLI nativa para integrar paletas directamente en tu VS Code.</p>
                  </div>
                  <button className="relative z-10 px-6 py-2.5 bg-background text-foreground rounded-full text-xs font-bold hover:scale-105 transition-all">
                    Ver Documentación
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
