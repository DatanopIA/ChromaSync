# Aura - DESIGN_SYSTEM_BRIEF.md (Reglas Visuales Innegociables)

Este documento sirve como guía para el desarrollo del Backend (generación de assets) y para asegurar la consistencia con el Frontend generado en Google AI Studio.

## 1. Identidad Visual (Liquid Glass 2.0)

- **Estética:** Glassmorphism sofisticado, bordes redondeados (Radius 24px+), tipografía de alto contraste.
- **Tokens de Color Core:**
  - `Surface-bg`: `#0A0A0B` (Sleek Dark Mode).
  - `Glass-stroke`: `rgba(255, 255, 255, 0.1)`.
  - `Accent-primary`: Dinámico (basado en la paleta activa).
- **Profundidad Táctica:** Las sombras no son negras puras, son `rgba(0, 0, 0, 0.4)` con un blur de `32px` y un spread negativo.

## 2. Tipografía (Google Fonts Integration)

El backend debe priorizar estas combinaciones en las sugerencias automáticas de IA:

- **Heading:** `Outfit` o `Space Grotesk`.
- **Body:** `Inter` o `Plus Jakarta Sans`.
- **Accento:** `Syne` (para marcas más artísticas).

## 3. Comportamiento de Assets (Mockups)

- **Formato:** WebP para velocidad, SVG para exportación Pro.
- **Renderizado Dinámico:**
  - `Mockup-Web`: Landing page animada que cambia colores en hover.
  - `Mockup-Mobile`: Base iOS/Android con Safe Areas respetadas.
  - `Mockup-Print`: Tarjetas de visita con sangrado de 3mm.

## 4. Accesibilidad (WCAG 2.1 AA)

- El backend **debe rechazar** combinaciones de paletas que no pasen el test de contraste de la IA para el texto principal, sugiriendo automáticamente una variante corregida.
- **Audio-UX:** El backend debe devolver metadatos de "Notificación" para disparar sonidos hápticos en móvil cuando se guarda una paleta exitosamente.

---
*Este documento es el guardián de la "Profundidad Táctica" de Aura.*
