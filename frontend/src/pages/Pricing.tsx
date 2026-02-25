import { useAura } from "../context/AuraContext";
import { PricingSection, PricingPlan } from "../components/ui/pricing";

export default function Pricing() {
    const { createCheckoutSession, user, signInWithGoogle } = useAura();

    const handleSubscribe = (priceId: string | null) => {
        if (!priceId) return;
        createCheckoutSession(priceId);
    };

    const tiers: PricingPlan[] = [
        {
            name: "Free",
            price: "0",
            period: "month",
            features: [
                "5 paletas generadas por IA al día",
                "Exportación básica CSS y PNG",
                "Comunidad pública",
                "Mockups básicos"
            ],
            description: "Para exploradores del color y entusiastas.",
            buttonText: "Comenzar Gratis",
            onClick: () => handleSubscribe(null),
        },
        {
            name: "Plus",
            price: "7.99",
            period: "month",
            features: [
                "Paletas ilimitadas",
                "Psicología del color avanzada",
                "Sugerencias tipográficas",
                "Exportación en SVG y PDF",
                "Sin anuncios",
                "Mockups básicos"
            ],
            description: "Para diseñadores freelance y creadores de contenido.",
            buttonText: "Mejorar a Plus",
            onClick: () => handleSubscribe("price_1T4IVtPFZw0GeHfahmdGvBS6"),
            isPopular: true,
        },
        {
            name: "Pro",
            price: "14.99",
            period: "month",
            features: [
                "Todo lo de Plus",
                "Plugins para Figma y Canva",
                "Colaboración en tiempo real",
                "Gestión de equipos (Ilimitado)",
                "Mockups Pro editables",
                "Soporte prioritario"
            ],
            description: "Para agencias y estudios de diseño profesional.",
            buttonText: "Obtener Pro",
            onClick: () => handleSubscribe("price_1T4IVtPFZw0GeHfa9ZcnJ9vr"),
        }
    ];

    return (
        <div className="min-h-full w-full">
            <PricingSection
                plans={tiers}
                title="Planes de Suscripción"
                description="Elige el plan que mejor se adapte a tu flujo creativo y empieza a diseñar con la potencia de la IA."
                currencySymbol="€"
            />
            <div className="pb-20 text-center">
                <p className="text-muted-foreground text-sm">
                    Todos los planes incluyen actualizaciones gratuitas del motor de IA y soporte básico.
                </p>
            </div>
        </div>
    );
}
