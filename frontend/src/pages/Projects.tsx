import { useState } from "react";
import { Search, Filter, MoreHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  { id: 1, name: "Cyberpunk Neon", colors: ["#FF003C", "#00E5FF", "#FCEE0A", "#1A1A1A", "#FFFFFF"], date: "2 days ago", isAI: true },
  { id: 2, name: "Soft Minimal", colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD"], date: "1 week ago", isAI: false },
  { id: 3, name: "Earthy Tones", colors: ["#8B5A2B", "#CD853F", "#DEB887", "#F5DEB3", "#FFF8DC"], date: "2 weeks ago", isAI: false },
  { id: 4, name: "Ocean Breeze", colors: ["#00B4DB", "#0083B0", "#E0EAFC", "#CFDEF3", "#FFFFFF"], date: "1 month ago", isAI: true },
  { id: 5, name: "Vintage Retro", colors: ["#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#264653"], date: "2 months ago", isAI: false },
  { id: 6, name: "Dark Mode UI", colors: ["#121212", "#1E1E1E", "#BB86FC", "#03DAC6", "#CF6679"], date: "3 months ago", isAI: true },
];

import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-medium tracking-tight"
          >
            Projects
          </motion.h1>
          <p className="text-gray-500 text-lg">Your saved color palettes and collections.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search palettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
          <button
            className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Filtrar proyectos"
            title="Filtrar proyectos"
          >
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col gap-4 cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="flex h-40 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {project.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.5]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">{project.name}</h3>
                <button
                  className="text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Más opciones"
                  title="Más opciones"
                >
                  <MoreHorizontal size={20} />
                </button>
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
        ))}
      </div>
    </div>
  );
}
