import { motion } from "framer-motion";

export default function Terms() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-[800px] mx-auto px-6 py-20 flex flex-col gap-12"
        >
            <div className="flex flex-col gap-4 border-b border-border pb-8">
                <h1 className="text-4xl font-bold tracking-tight">Términos y Condiciones</h1>
                <p className="text-muted-foreground">Última actualización: Febrero 2026</p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none flex flex-col gap-8 text-muted-foreground leading-relaxed">
                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">1. Aceptación de los Términos</h2>
                    <p>
                        Al acceder y utilizar ChromaSync Aura (en adelante, "el Servicio"), usted acepta estar sujeto a estos Términos y Condiciones y a todas las leyes y regulaciones aplicables en España.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">2. Uso del Servicio</h2>
                    <p>
                        El Servicio proporciona herramientas de diseño potenciadas por IA. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Se prohíbe cualquier uso ilícito o que infrinja los derechos de propiedad intelectual de terceros.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">3. Planes de Suscripción y Pagos</h2>
                    <p>
                        Ofrecemos planes gratuitos y de pago (Plus y Pro). Los pagos se procesan a través de Stripe. Al suscribirse, usted acepta los cargos recurrentes especificados en su plan elegido. Las cancelaciones pueden realizarse en cualquier momento desde los ajustes de su cuenta.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">4. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido, marcas y logotipos asociados con ChromaSync Aura y DatanopIA son propiedad exclusiva de la Empresa. El contenido generado por el usuario pertenece al usuario, aunque concede a la Empresa una licencia limitada para su gestión dentro del Servicio.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">5. Limitación de Responsabilidad</h2>
                    <p>
                        DatanopIA no garantiza que el Servicio sea ininterrumpido o libre de errores. No seremos responsables de daños directos, indirectos o incidentales resultantes del uso o la imposibilidad de uso del Servicio.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">6. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Estos términos se rigen por la legislación española. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de España.
                    </p>
                </section>
            </div>
        </motion.div>
    );
}
