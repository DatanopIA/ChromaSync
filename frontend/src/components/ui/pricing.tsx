"use client";

import { motion, useSpring } from "framer-motion";
import React, {
    useState,
    useRef,
    useEffect,
} from "react";
import { Link } from "react-router-dom";
import { Check, Star as LucideStar } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITY FUNCTIONS ---

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- BASE UI COMPONENTS (BUTTON) ---

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

// --- INTERACTIVE STARFIELD ---

function Star({
    mousePosition,
    containerRef,
}: {
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement>;
}) {
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
            // Stars move away from mouse (magnetic push) or pull? Let's do a subtle pull for "Aura"
            const pullX = deltaX * force * 0.4;
            const pullY = deltaY * force * 0.4;
            springX.set(pullX);
            springY.set(pullY);
        } else {
            springX.set(0);
            springY.set(0);
        }
    }, [mousePosition, initialPos, containerRef]);

    return (
        <motion.div
            className="absolute bg-black dark:bg-white rounded-full pointer-events-none"
            style={{
                top: initialPos.top,
                left: initialPos.left,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                x: springX,
                y: springY,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{
                duration: 2 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
            }}
        />
    );
}

function InteractiveStarfield({
    mousePosition,
    containerRef,
}: {
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement>;
}) {
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
}

// --- PRICING COMPONENT LOGIC ---

export interface PricingPlan {
    name: string;
    price: string;
    period: string;
    features: string[];
    description: string;
    buttonText: string;
    href?: string;
    onClick?: () => void;
    isPopular?: boolean;
}

interface PricingSectionProps {
    plans: PricingPlan[];
    title?: string;
    description?: string;
    currencySymbol?: string;
}

export function PricingSection({
    plans,
    title = "Planes de Suscripción",
    description = "Elige el plan que mejor se adapte a ti.",
    currencySymbol = "€",
}: PricingSectionProps) {
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
            className="relative w-full bg-background py-20 overflow-hidden"
        >
            <InteractiveStarfield
                mousePosition={mousePosition}
                containerRef={containerRef}
            />
            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-xl mx-auto"
                    >
                        {description}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} index={index} currencySymbol={currencySymbol} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PricingCard({ plan, index, currencySymbol }: { plan: PricingPlan; index: number; currencySymbol: string }) {
    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
            }}
            className={cn(
                "rounded-[32px] p-8 flex flex-col relative border transition-shadow duration-500",
                plan.isPopular
                    ? "border-primary bg-white shadow-2xl z-20 md:-mt-4 md:mb-4"
                    : "border-border bg-white/60 backdrop-blur-xl z-10",
            )}
        >
            {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-30">
                    <div className="bg-black text-white py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-xl border border-white/10">
                        <LucideStar className="text-white h-4 w-4 fill-current" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                            MÁS POPULAR
                        </span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {plan.description}
                    </p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                        <NumberFlow
                            value={Number(plan.price)}
                            format={{
                                style: "currency",
                                currency: currencySymbol === "€" ? "EUR" : "USD",
                                minimumFractionDigits: Number(plan.price) === 0 ? 0 : 2,
                            }}
                        />
                    </span>
                    {Number(plan.price) > 0 && (
                        <span className="text-sm font-semibold text-muted-foreground">
                            / {plan.period === "month" ? "mes" : "año"}
                        </span>
                    )}
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                                <Check className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm text-foreground/70">{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto">
                    {plan.onClick ? (
                        <Button
                            onClick={plan.onClick}
                            className={cn(
                                "w-full rounded-full py-6 text-base font-bold transition-all duration-300",
                                plan.isPopular ? "bg-black text-white hover:scale-[1.02] shadow-xl" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            )}
                        >
                            {plan.buttonText}
                        </Button>
                    ) : (
                        <Link
                            to={plan.href || "#"}
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "w-full rounded-full py-6 text-base font-bold transition-all duration-300",
                                plan.isPopular ? "bg-black text-white hover:scale-[1.02] shadow-xl" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            )}
                        >
                            {plan.buttonText}
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
