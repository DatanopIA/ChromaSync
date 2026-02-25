# 💎 Aura Professional Methodology & Architecture Skill

Esta "Skill" define el estándar de oro utilizado en el proyecto ChromaSync Aura. Su implementación garantiza agilidad, diseño de clase mundial y una arquitectura robusta desde el día 1.

---

## 1. Diseño y Estética (Fidelity-First)

**Principio:** No crearemos "MVPs feos". La estética es una funcionalidad de confianza.

- **Framer Motion Obligatorio:** Todas las interfaces deben tener micro-interacciones (hover, transitions) y animaciones fluidas.
- **Micro-interacciones Premium:** Uso de componentes como `MagneticText`, `MorphingCursor` o Fondos Aurora desde el inicio.
- **Glassmorphism & Shaders:** Uso de transparencias, desenfoques y gradientes modernos para dar sensación de "Premium App".
- **Sin Placeholders:** Uso de imágenes reales generadas por IA para que el cliente vea el potencial real del diseño.

## 2. Arquitectura de Datos (The Triple-Stack)

**Principio:** Una base sólida evita refactorizaciones costosas.

- **Supabase (Auth/Storage):** Gestión de usuarios y archivos inmediata.
- **Prisma (Mapping):** Gestión del esquema de base de datos tipada y segura.
- **GraphQL (API):** Crucial para el rendimiento móvil. Evitamos múltiples llamadas REST y obtenemos solo lo que necesitamos.

## 3. Estrategia de Monetización (Conversion-Centric)

**Principio:** El flujo de pago debe ser invisible y sin fricciones.

- **Guest-to-Member Conversion:** Permitir que los usuarios paguen como invitados en Stripe.
- **Vinculación por Email:** El webhook de Stripe debe usar `upsert` basado en el email para asegurar que el pago se vincule al usuario incluso si este se registra *después* de pagar.
- **Mobile-First Checkout:** Redirección directa a Stripe sin forzar login previo, lo que dispara la conversión en dispositivos móviles.

## 4. Ingeniería de Despliegue (Zero-Friction DevOps)

**Principio:** Si no es accesible en el móvil, no está terminado.

- **Vercel Routing:** Archivo `vercel.json` con rewrites para apps de una sola página (evita errores 404).
- **Railway Infrastructure:** Uso de contenedores en Railway para el backend con comandos `prestart` que aseguren que Prisma está listo.
- **Environment Awareness:** El código debe detectar automáticamente si está en `localhost` o en Producción para usar la URL del backend correcta sin configuración manual.

## 5. Proceso de Desarrollo (Agile Momentum)

**Principio:** Velocidad sin sacrificar calidad.

- **Validación Rápida:** Verificación constante de los despliegues en vivo durante el desarrollo.
- **Documentación Viva:** Mantener un `ImplementationPlan.md` y un `KNOWLEDGE_DEPLOYMENT.md` actualizado en cada sesión.
- **Proactividad de IA:** El asistente debe anticipar errores comunes de CORS, Routing y Webhooks antes de que el usuario los reporte.

---

**CÓDIGO DE HONOR:** Juro por mi arquitectura que aplicaré estos estándares en cada nuevo proyecto (`Instant Pantry`, `Aura`, y los que vengan) para asegurar que el resultado sea siempre **EXCEPCIONAL**.
