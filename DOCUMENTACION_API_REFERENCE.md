# Aura - API & Integration Reference

Esta guía detalla los endpoints, payloads y desencadenadores de automatización para conectar el Frontend con el Backend.

## 1. Autenticación (Supabase / Custom)

- **POST `/auth/login`**: Credenciales o Social.
- **POST `/auth/register`**: Crea usuario en DB + Perfil en Stripe (Free).

## 2. Paletas & Branding

### `GET /api/palettes`

Listado de paletas del usuario o públicas.

- Query params: `limit`, `offset`, `category` (IA/Manual), `search`.

### `POST /api/palettes/generate-ia`

Desencadena el motor de IA.

```json
{
  "context": "Eco-friendly cosmetic shop",
  "vibe": "minimalist/pastel",
  "source_image": "base64_string (optional)"
}
```

**Trigger:** Si `source_image` existe, invoca `vision-color-extractor` worker.

### `PATCH /api/palettes/:id`

Edición de colores. Solo para `Owner` o `Editor`.

## 3. Integraciones Externas

### Figma Plugin Sync (Pro)

- **POST `/api/integrations/figma/push`**
- **Payload:** `{ palette_id, figma_access_token }`
- **Acción:** El backend usa la REST API de Figma para crear/actualizar "Styles" en el equipo del usuario.

### Canvas (Plus/Pro)

- **POST `/api/integrations/canva/export`**
- **Acción:** Genera una imagen PNG/SVG y devuelve un `upload_url` compatible con el Adobe/Canva SDK.

## 4. Colaboración (Real-time)

Usar **GraphQL Subscriptions** o **Socket.io**.

- **Canal:** `resource_updates:{resource_id}`
- **Mensaje:** `{ user, action: "CURSOR_MOVE" | "COLOR_CHANGE", data }`

## 5. Gamificación Triggers

- **Trigger `on_palette_generated`**: +10 pts (Max 5/día para evitar spam).
- **Trigger `on_swipe_mode`**: Registra preferencia en `activity_log`. Si hay 50 swipes similares, dispara worker `ai-preference-learning`.
- **Trigger `on_streak`**: Disparado por cronjob cada medianoche para verificar `last_activity`.

## 6. Automatización de Notificaciones (Email/Push)

| Evento | Canal | Payload |
| :--- | :--- | :--- |
| Suscripción Exitosa | Email | Plantilla `welcome_plus.html` |
| Comentario en Recurso | Push | `"{user} ha comentado en tu Moodboard"` |
| Nueva Tendencia | Email | "Las 3 paletas más populares de la semana" |

## 7. Mockup Renderer Worker

- **Queue:** `mockup-generator`
- **Job:** Toma un `template_id` y un `palette_id`.
- **Output:** URL de S3 con el mockup renderizado.
- **Nota:** Los usuarios Free ven el mockup con marca de agua (Watermark).
