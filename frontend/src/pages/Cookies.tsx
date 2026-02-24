import { motion } from "framer-motion";

export default function Cookies() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-[800px] mx-auto px-6 py-20 flex flex-col gap-12"
        >
            <div className="flex flex-col gap-4 border-b border-border pb-8">
                <h1 className="text-4xl font-bold tracking-tight">Política de Cookies</h1>
                <p className="text-muted-foreground">Última actualización: Febrero 2026</p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none flex flex-col gap-8 text-muted-foreground leading-relaxed">
                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">1. ¿Qué son las cookies?</h2>
                    <p>
                        ChromaSync Aura utiliza cookies y tecnologías similares para recopilar información sobre el uso de nuestra plataforma y proporcionar una mejor experiencia de navegación. Una cookie es un pequeño archivo de texto que se almacena en su dispositivo cuando visita un sitio web.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">2. Tipos de cookies que utilizamos</h2>
                    <ul className="list-disc pl-6 flex flex-col gap-2">
                        <li>
                            <span className="text-foreground font-medium">Cookies Técnicas:</span> Necesarias para el correcto funcionamiento del sitio (inicio de sesión, seguridad, etc.).
                        </li>
                        <li>
                            <span className="text-foreground font-medium">Cookies de Análisis:</span> Nos permiten entender cómo interactúan los usuarios con nuestra herramienta (páginas más visitadas, tiempo de sesión) para mejorar el servicio.
                        </li>
                        <li>
                            <span className="text-foreground font-medium">Cookies de Preferencias:</span> Permiten recordar sus ajustes (como el modo oscuro o idioma).
                        </li>
                    </ul>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">3. Gestión de Cookies</h2>
                    <p>
                        Al navegar por nuestro sitio, usted acepta el uso de estas cookies. Sin embargo, puede bloquear o eliminar las cookies en cualquier momento ajustando las preferencias de su navegador. Tenga en cuenta que desactivar ciertas cookies puede afectar la funcionalidad del Servicio.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">4. Terceros</h2>
                    <p>
                        Utilizamos servicios de terceros como Supabase para la autenticación y Stripe para los pagos, los cuales pueden utilizar sus propias cookies para gestionar sus servicios respectivos de forma segura.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">5. Cumplimiento Legal</h2>
                    <p>
                        Esta política cumple con la Directiva 2002/58/CE sobre la privacidad y las comunicaciones electrónicas y la Ley de Servicios de la Sociedad de la Información (LSSI) en España.
                    </p>
                </section>
            </div>
        </motion.div>
    );
}
