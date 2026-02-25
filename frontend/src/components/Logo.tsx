import { motion } from "framer-motion";

export default function Logo({ size = 32, className = "" }: { size?: number, className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <motion.svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                {/* Glow layer */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="url(#aura-glow)"
                    initial={{ opacity: 0.3, scale: 0.8 }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Circle 1 - Pink/Purple */}
                <motion.circle
                    cx="40"
                    cy="50"
                    r="25"
                    fill="url(#circle1-gradient)"
                    animate={{
                        x: [0, 5, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ mixBlendMode: 'plus-lighter' as any }}
                />

                {/* Circle 2 - Blue/Cyan */}
                <motion.circle
                    cx="60"
                    cy="50"
                    r="25"
                    fill="url(#circle2-gradient)"
                    animate={{
                        x: [0, -5, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    style={{ mixBlendMode: 'plus-lighter' as any }}
                />

                <defs>
                    <radialGradient id="aura-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(40)">
                        <stop stopColor="#FF00FF" stopOpacity="0.4" />
                        <stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="circle1-gradient" x1="15" y1="25" x2="65" y2="75" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF00FF" />
                        <stop offset="1" stopColor="#9D00FF" />
                    </linearGradient>

                    <linearGradient id="circle2-gradient" x1="35" y1="25" x2="85" y2="75" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00E5FF" />
                        <stop offset="1" stopColor="#009DFF" />
                    </linearGradient>
                </defs>
            </motion.svg>
        </div>
    );
}
