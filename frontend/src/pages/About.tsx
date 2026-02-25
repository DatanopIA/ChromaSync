import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { Sparkles, Target, ShieldCheck, Heart } from "lucide-react";

// --- STAR COMPONENTS ---
const Star: React.FC<{
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement>;
}> = ({
    mousePosition,
    containerRef,
}) => {
        const [initialPos] = useState({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
        });

        const springConfig = { stiffness: 50, damping: 20, mass: 0.1 };
        const springX = useSpring(0, springConfig);
        const springY = useSpring(0, springConfig);

        useEffect(() => {
            if (
                !containerRef.current ||
                mousePosition.x === null ||
                mousePosition.y === null
            ) {
                springX.set(0);
                springY.set(0);
                return;
            }

            const containerRect = containerRef.current.getBoundingClientRect();
            const starX =
                containerRect.left +
                (parseFloat(initialPos.left) / 100) * containerRect.width;
            const starY =
                containerRect.top +
                (parseFloat(initialPos.top) / 100) * containerRect.height;

            const deltaX = mousePosition.x - starX;
            const deltaY = mousePosition.y - starY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const radius = 500;

            if (distance < radius) {
                const force = 1 - distance / radius;
                const pullX = deltaX * force * 0.4;
                const pullY = deltaY * force * 0.4;
                springX.set(pullX);
                springY.set(pullY);
            } else {
                springX.set(0);
                springY.set(0);
            }
        }, [mousePosition, initialPos, containerRef, springX, springY]);

        return (
            <motion.div
                className="absolute bg-black dark:bg-white rounded-full pointer-events-none"
                style={{
                    top: initialPos.top,
                    left: initialPos.left,
                    width: `${1.5 + Math.random() * 2.5}px`,
                    height: `${1.5 + Math.random() * 2.5}px`,
                    x: springX,
                    y: springY,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                }}
            />
        );
    }

const InteractiveStarfield: React.FC<{
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement>;
}> = ({
    mousePosition,
    containerRef,
}) => {
        return (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                {Array.from({ length: 180 }).map((_, i) => (
                    <Star
                        key={`star-${i}`}
                        mousePosition={mousePosition}
                        containerRef={containerRef}
                    />
                ))}
            </div>
        );
    };

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState<{
        x: number | null;
        y: number | null;
    }>({ x: null, y: null });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = event;
        setMousePosition({ x: clientX, y: clientY });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePosition({ x: null, y: null })}
            className="relative min-h-screen w-full overflow-hidden bg-background"
        >
            <InteractiveStarfield
                mousePosition={mousePosition}
                containerRef={containerRef}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[1000px] mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24 font-sans"
            >
                {/* Hero Section */}
                <section className="flex flex-col items-center text-center gap-4 md:gap-6">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest border border-primary/20"
                    >
                        Nuestra Historia
                    </motion.span>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
                        Democratizando la <span className="bg-foreground text-background px-4 md:px-6 py-1 md:py-2 rounded-xl md:rounded-2xl italic inline-block transform -rotate-1 shadow-2xl">Inteligencia</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        En DatanopIA, no solo construimos software; creamos puentes entre la complejidad tecnológica y la expresión humana.
                    </p>
                </section>

                {/* Storytelling Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center bg-white/40 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 border border-border/50 shadow-sm">
                    <div className="flex flex-col gap-8">
                        <h2 className="text-3xl font-bold">El origen de una visión</h2>
                        <div className="flex flex-col gap-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                Todo comenzó con una pregunta simple: <span className="text-foreground font-medium">¿Por qué la tecnología más avanzada parece reservada para unos pocos?</span> En un mundo donde la IA avanzaba a pasos agigantados, sentíamos que faltaba algo esencial: la alma y la accesibilidad.
                            </p>
                            <p>
                                DatanopIA nació de la intersección entre la lógica más rigurosa y la magia de la creatividad. Somos una empresa tecnológica que cree firmemente que el futuro no se trata de que las máquinas reemplacen a los humanos, sino de cómo las máquinas pueden empoderarnos para alcanzar nuestra versión más brillante.
                            </p>
                            <p>
                                ChromaSync Aura es nuestro primer gran paso en este viaje. Una herramienta diseñada para que cualquier persona, desde un diseñador senior hasta alguien que está empezando su primer emprendimiento, pueda dominar el lenguaje del color con la misma facilidad y profundidad.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000"
                            alt="DatanopIA Vision"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                    </div>
                </section>

                {/* Values Grid */}
                <section className="flex flex-col gap-8 md:gap-12">
                    <div className="text-center flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold italic uppercase tracking-tighter">Nuestros Valores</h2>
                        <p className="text-muted-foreground text-sm md:text-base">Lo que nos impulsa a innovar cada día.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                title: "Simplicidad Radical",
                                desc: "Convertimos lo complejo en intuitivo. Si no es fácil de usar, no es DatanopIA.",
                                icon: <Sparkles className="w-8 h-8 text-purple-500" />
                            },
                            {
                                title: "IA with Purpose",
                                desc: "Usamos la inteligencia artificial para amplificar la creatividad humana, no para limitarla.",
                                icon: <Target className="w-8 h-8 text-blue-500" />
                            },
                            {
                                title: "Universal Access",
                                desc: "Soluciones de grado industrial adaptadas para todos los presupuestos y niveles de habilidad.",
                                icon: <ShieldCheck className="w-8 h-8 text-green-500" />
                            }
                        ].map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/60 backdrop-blur-md border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-muted w-fit rounded-2xl">{v.icon}</div>
                                <h3 className="text-xl font-bold mb-2 md:mb-3">{v.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-foreground text-background rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center flex flex-col items-center gap-6 md:gap-8 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse relative z-10" />
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight relative z-10">¿Te unes a la revolución?</h2>
                    <p className="text-background/60 text-base md:text-lg max-w-xl relative z-10">
                        Estamos aquí para ayudarte a brillar. DatanopIA es tu socio tecnológico, hoy y en el futuro que estamos diseñando juntos.
                    </p>
                </section>
            </motion.div>
        </div>
    );
}
