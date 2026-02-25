# 🚀 Patrones de Éxito: Despliegue y Pagos Móviles (The Golden Guide)

Este documento resume las soluciones técnicas clave aplicadas en **ChromaSync** para garantizar que los pagos de Stripe funcionen en móviles, el servidor sea estable en Railway y la web cargue perfecta en Vercel. **Copia este patrón para cada nuevo proyecto.**

---

## 1. Frontend (Vercel + React)

### 📂 `vercel.json` (Raíz del proyecto frontend)

Evita el error **404 NOT FOUND** al refrescar la página en el móvil o entrar directamente en rutas como `/pricing`.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 🧠 Lógica de Endpoints Inteligente (`AuraContext.tsx`)

Nunca uses `localhost` a secas. La app debe saber si estás en tu PC o en el móvil de producción.

```typescript
const isLocal = typeof window !== 'undefined' && 
                (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const GRAPHQL_ENDPOINT = isLocal 
  ? "http://localhost:4000/graphql" 
  : "https://tu-backend-en-railway.app/graphql";
```

---

## 2. Backend (Railway + Node.js)

### 📦 `package.json`

Asegura que la base de datos (Prisma) esté lista antes de que el servidor intente leerla.

```json
"scripts": {
  "prestart": "npx prisma generate",
  "start": "node index.js"
}
```

### ⚙️ Variables de Entorno en Railway (Configuración)

| Variable | Valor | Por qué |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Activa el comportamiento de servidor real. |
| `NPM_CONFIG_LEGACY_PEER_DEPS` | `true` | Evita errores de instalación de librerías (CORS, Apollo, etc). |
| `PORT` | `4000` (o el que uses) | Railway lo necesita para saber dónde escuchar. |

### 🔍 Carga Progresiva de `.env` (`index.js`)

No dejes que `dotenv` intente cargar archivos inexistentes en producción, esto puede apagar el servidor.

```javascript
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Las variables en Railway se leen directamente de process.env
```

---

## 3. Stripe (Payments Móviles)

### 🔗 Webhook & Linking

- **Invitados:** Permitir pagos sin login (Guest Checkout) facilita la conversión en móviles.
- **Email es el Rey:** Usa el `email` de Stripe como llave para vincular el pago a la cuenta del usuario cuando este inicie sesión (Upsert).

### 🛠️ Verificación de Salud

Crea siempre una ruta `/health` sencilla para saber si el servidor está vivo:

```javascript
app.get('/health', (req, res) => res.json({ status: 'Online' }));
```

---

## 📜 Regla de Oro para el Futuro

Cada vez que crees un proyecto con este Stack (React + Node + Railway + Stripe):

1. **Frontend:** Añade `vercel.json` de inmediato.
2. **Backend:** Configura el `prestart` y el `NODE_ENV`.
3. **Stripe:** Usa rutas absolutas de Railway, nunca `localhost`.

**¡Con esto tus apps serán "Mobile-Ready" desde el minuto 1!**
