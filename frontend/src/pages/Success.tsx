import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
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
            </motion.div>
        </div>
    );
}
