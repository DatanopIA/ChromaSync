import { motion } from "framer-motion";

export default function Privacy() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-[800px] mx-auto px-6 py-20 flex flex-col gap-12"
        >
            <div className="flex flex-col gap-4 border-b border-border pb-8">
                <h1 className="text-4xl font-bold tracking-tight">Política de Privacidad</h1>
                <p className="text-muted-foreground">Última actualización: Febrero 2026</p>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none flex flex-col gap-8 text-muted-foreground leading-relaxed">
                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">1. Responsable del Tratamiento</h2>
                    <p>
                        DatanopIA (en adelante, "la Empresa"), con domicilio en España, es el responsable del tratamiento de sus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información personal obtenida a través de ChromaSync Aura.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">2. Datos que Recopilamos</h2>
                    <p>Podemos recopilar los siguientes datos:</p>
                    <ul className="list-disc pl-6 flex flex-col gap-2">
                        <li>Identificadores personales (Nombre, correo electrónico).</li>
                        <li>Información de pago (gestionada de forma segura a través de Stripe).</li>
                        <li>Datos de uso y preferencias dentro de la aplicación.</li>
                        <li>Datos generados por el usuario (paletas, proyectos).</li>
                    </ul>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">3. Finalidad del Tratamiento</h2>
                    <p>Sus datos se utilizan para:</p>
                    <ul className="list-disc pl-6 flex flex-col gap-2">
                        <li>Proporcionar y mantener el Servicio.</li>
                        <li>Procesar sus transacciones de suscripción.</li>
                        <li>Personalizar su experiencia de usuario.</li>
                        <li>Mejorar nuestras herramientas de Inteligencia Artificial.</li>
                        <li>Cumplir con obligaciones legales.</li>
                    </ul>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">4. Base Legal (RGPD)</h2>
                    <p>
                        De acuerdo con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la ley española, tratamos sus datos basándonos en:
                    </p>
                    <ul className="list-disc pl-6 flex flex-col gap-2">
                        <li>Su consentimiento explícito.</li>
                        <li>La ejecución de un contrato de servicio.</li>
                        <li>El interés legítimo para la mejora del producto.</li>
                    </ul>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">5. Derechos del Usuario</h2>
                    <p>
                        Usted tiene derecho a acceder, rectificar, suprimir y portar sus datos personales, así como a limitar u oponerse a su tratamiento.
                    </p>
                    <p>
                        Para ejercer estos derechos, puede contactar con nosotros en <span className="text-foreground font-medium">info@artbymaeki.com</span>.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground">6. Seguridad de los Datos</h2>
                    <p>
                        Implementamos medidas técnicas y organizativas avanzadas (encriptación SSL, autenticación segura) para proteger sus datos contra acceso no autorizado, pérdida o alteración.
                    </p>
                </section>
            </div>
        </motion.div>
    );
}
