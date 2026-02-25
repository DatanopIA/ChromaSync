import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAura } from "../context/AuraContext";

export default function Success() {
    const { simulatePlanUpgrade } = useAura();
    return (
        <div className="min-h-full w-full flex items-center justify-center p-6 bg-[#fcfcfc]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-8"
            >
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={40} />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">¡Pago Completado!</h1>
                    <p className="text-gray-500">
                        Tu suscripción ha sido activada con éxito. Ya tienes acceso a todas las funciones premium de ChromaSync Aura.
                    </p>
                </div>

                <div className="w-full h-px bg-gray-100 my-2"></div>

                <Link
                    to="/generator"
                    className="w-full py-4 bg-black text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                    Ir al Generador
                    <ArrowRight size={18} />
                </Link>

                <Link
                    to="/"
                    className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
                >
                    Volver al Inicio
                </Link>

                {/* Developer simulation buttons */}
                <div className="flex gap-2 mt-4 pt-10">
                    <button
                        onClick={() => simulatePlanUpgrade('PLUS')}
                        className="text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors"
                    >
                        Simular PLUS
                    </button>
                    <button
                        onClick={() => simulatePlanUpgrade('PRO')}
                        className="text-[10px] uppercase font-bold tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full hover:bg-violet-100 transition-colors"
                    >
                        Simular PRO
                    </button>
                    <button
                        onClick={() => simulatePlanUpgrade('FREE')}
                        className="text-[10px] uppercase font-bold tracking-widest text-gray-600 bg-gray-50 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        Reset FREE
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
