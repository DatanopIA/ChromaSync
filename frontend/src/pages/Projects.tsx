import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAura } from "../context/AuraContext";
import { Search, Filter, MoreHorizontal, Sparkles, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
  const { user, getMyPalettes, deletePalette, loading: authLoading, signInWithGoogle, searchUserByEmail, addCollaboration } = useAura();
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProjects();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const fetched = await getMyPalettes();
      const mapped = fetched.map(p => ({
        id: p.id,
        name: p.name,
        colors: p.colors.map((c: any) => c.hex),
        date: new Date(Number(p.createdAt)).toLocaleDateString(),
        isAI: p.aiGenerated
      }));
      setUserProjects(mapped);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que quieres borrar el kit "${name}"? Esta acción no se puede deshacer.`)) {
      try {
        await deletePalette(id);
        setUserProjects(prev => prev.filter(p => p.id !== id));
        alert("Paleta eliminada con éxito ✨");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("No se pudo borrar el proyecto. Reintenta más tarde.");
      }
    }
  };



  const handleInvite = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (user?.plan === 'FREE') {
      alert("La colaboración en tiempo real es una función PLUS/PRO. Por favor, actualiza tu plan para invitar a otros.");
      navigate('/pricing');
      return;
    }
    const email = prompt(`Introduce el email del compañero que quieres invitar a colaborar en "${name}":`);
    if (email) {
      try {
        const invitedUser = await searchUserByEmail(email);
        if (!invitedUser) {
          alert("No se encontró ningún usuario con ese email. Asegúrate de que tu compañero esté registrado en ChromaSync Aura.");
          return;
        }

        const role = confirm(`¿Quieres que ${invitedUser.fullName} sea EDITOR? (Cancelar para solo LECTOR/VIEWER)`) ? 'EDITOR' : 'VIEWER';

        await addCollaboration(id, 'PALETTE', invitedUser.id, role);
        alert(`¡Invitación enviada con éxito a ${invitedUser.fullName} como ${role}!`);
      } catch (error: any) {
        console.error("Error inviting collaborator:", error);
        alert(`Error al enviar invitación: ${error.message || 'Error desconocido'}`);
      }
    }
  };

  const filteredProjects = userProjects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-8 md:gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-3 md:gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-medium tracking-tight"
          >
            Proyectos
          </motion.h1>
          <p className="text-gray-500 text-base md:text-lg">Tus paletas y colecciones de color guardadas.</p>
        </div>

        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar paletas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <button
            className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600 shrink-0"
            aria-label="Filtrar proyectos"
            title="Filtrar proyectos"
          >
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <RefreshCw className="mx-auto animate-spin text-gray-400 mb-4" size={40} />
            <p className="text-gray-500">Cargando tus proyectos...</p>
          </div>
        ) : !user ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <h2 className="text-2xl font-medium mb-4">Inicia sesión para ver tus proyectos</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Tus Brand Kits se guardan de forma segura en la nube para que puedas acceder a ellos desde cualquier lugar.</p>
            <button
              onClick={() => signInWithGoogle()}
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-all font-medium"
            >
              Iniciar sesión con Google
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-6">No se encontraron proyectos.</p>
            <button
              onClick={() => navigate('/generator')}
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-all font-medium"
            >
              Crear mi primer Brand Kit
            </button>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col gap-4"
            >
              <div
                className="flex h-40 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/projects/${project.id}`, { state: { colors: project.colors, name: project.name } })}
              >
                {project.colors.map((color: string, i: number) => (
                  <div
                    key={i}
                    className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.5]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2 px-1">
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="font-medium text-lg text-gray-800 truncate cursor-pointer hover:text-black flex-1"
                    onClick={() => navigate(`/projects/${project.id}`, { state: { colors: project.colors, name: project.name } })}
                  >
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleInvite(e, project.id, project.name)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all active:scale-95"
                      aria-label={`Invitar a colaborador para ${project.name}`}
                      title="Invitar colaborador"
                    >
                      <UserPlus size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project.id, project.name)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95"
                      aria-label={`Borrar kit ${project.name}`}
                      title="Borrar kit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{project.date}</span>
                  {project.isAI && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-black">
                        <Sparkles size={12} /> AI
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
