# Aura - Mapa de Conectividad & Configuración de Servicios

Para que Aura sea funcional al 100%, necesitamos realizar las siguientes conexiones técnicas. Este es el listado de "puentes" que deben estar activos.

## 1. Núcleo de Energía (Backend & Datos)

- [x] **Base de Datos (PostgreSQL):** Conexión vía MCP Supabase establecida. Tablas creadas.
- [ ] **Cache & Real-time (Redis):** Pendiente (Recomendado: Upstash).
- [x] **Almacenamiento (S3/Storage):** Completado. Bucket 'aura-assets' creado en Supabase.

## 2. Cerebro IA (Generación de Branding)

- [ ] **Gemini API (Motor Principal):**
  - `Gemini 1.5 Pro/Flash`: Para generación de paletas por visión y psicología del color.
- [ ] **OpenAI API (Opcional):** Como fallback.

## 3. Motor Económico (Stripe)

- [ ] **Stripe Connect:** Para cobros recurrentes.
- [ ] **Stripe Webhooks:** El servidor debe escuchar a Stripe para saber CUÁNDO activar las funciones Pro de un usuario automáticamente.

## 4. Ecosistema de Diseño (Plugins)

- [ ] **Figma Developer API:** Necesaria para que el usuario pueda "Enviar a Figma" sus colores.
- [ ] **Adobe Express / Canva SDK:** Integración de botones de exportación directa.
- [ ] **Google Fonts API:** Catálogo dinámico para las combinaciones de tipografía.

## 5. Comunicación & Retención

- [ ] **Resend / SendGrid:** Para emails automáticos de bienvenida y recuperación de carritos.
- [ ] **Firebase Cloud Messaging (FCM):** Para notificaciones push en móvil y web (PWA).

---

# PASO 1: Infraestructura de Datos & Auth

*Este es el primer punto a conectar para tener una "viva".*

### ¿Qué necesitamos hacer ahora?

1. **Configurar el entorno Base**: Node.js + Express/Fastify con variables de entorno para las APIs mencionadas.
2. **Conectar la Base de Datos**: Ejecutar el `schema.sql` que creamos antes en un servidor vivo.
3. **Setup de Autenticación**: Usaremos **Supabase Auth** para una integración rápida con Google Login y gestión de sesiones. El backend verificará los JWT emitidos por Supabase.

---
**¿Empezamos configurando el Entorno Base y la Base de Datos?**
