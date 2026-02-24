# Aura - Estrategia de Monetización y Configuración de Stripe

## 1. Estructura de Oferta (Architecture of Offer)

### Plan FREE (El Gancho/Lead Magnet)

- **Propósito:** Viralidad y adquisición masiva.
- **Límites:** 5 paletas/día. Suficiente para probar el valor, pero escaso para un profesional.
- **Psicología:** Usa el "Swipe Mode" (Tinder de colores) para generar dopamina y hábito.

### Plan PLUS (7,99 €/mes - El "Essential")

- **Propósito:** Freelancers y entusiastas.
- **Valor Agregado:** Tipografía avanzada. Esto es clave porque "rompe" la utilidad de solo tener colores. Sin fuentes, el diseño está a medias.
- **Estrategia:** Eliminar todos los límites diarios. Sensación de libertad.

### Plan PRO (14,99 €/mes - El "High-Ticket SaaS")

- **Propósito:** Agencias y equipos de diseño.
- **Anclaje de Valor:** **Colaboración en equipo y Exportación a Figma/Canva**. Estas no son funciones de "diseño", son funciones de **ahorro de tiempo (ROI)**.
- **Incentivo:** Los mockups profesionales editables permiten presentar propuestas a clientes finales en minutos.

---

## 2. Configuración Técnica en Stripe

### IDs de Producto Recomendados (Skeleton)

- `prod_aura_free`: Price: 0€
- `prod_aura_plus`: Price ID: `price_plus_monthly` (7.99€)
- `prod_aura_pro`: Price ID: `price_pro_monthly` (14.99€)

### Lógica de Upgrade/Downgrade

- **Upgrade (Free -> Plus/Pro):** Prorrateo inmediato vía Stripe Billing. Desbloqueo instantáneo de permisos en la DB (`user_plan` enum).
- **Primer mes gratis:** Aplicar `trial_end` en la creación de la suscripción.
- **Cancelación:** Mantener acceso hasta el final del periodo de facturación (`cancel_at_period_end: true`).

---

## 3. Automatización de Revenue (Revenue Systems Architect)

- **Recuperación de Carrito Abandonado:** Si un usuario inicia el checkout de Pro y no termina, disparar email a las 4h con un "Caso de éxito" de cómo una agencia ahorró 10h/semana con Aura.
- **Upsell In-App:** Cuando el usuario Free alcance su 5ta paleta del día, mostrar un modal visualmente impactante: *"¿Te quedaste con la inspiración a medias? Pásate a Plus por menos de lo que cuesta un café a la semana"*.
- **Plan Anual:** Ofrecer 2 meses gratis (15-20% descuento) para maximizar el LTV y reducir el Churn.

---

## 4. Webhook Handler Logic (Pseudo-código)

```javascript
// stripe-webhook.js
const handleSubscriptionChange = async (subscription) => {
    const customerId = subscription.customer;
    const planId = subscription.items.data[0].plan.id;
    
    const newPlan = mapPriceIdToPlan(planId); // 'PLUS' or 'PRO'
    
    await db.users.update({
        where: { stripe_customer_id: customerId },
        data: { 
            plan: newPlan,
            updated_at: new Date()
        }
    });
    
    // Notificación Push
    sendNotification(userId, "¡Tu cuenta ha sido actualizada! Disfruta de tus nuevas funciones.");
};
```
