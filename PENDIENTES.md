# Pendientes de confirmación con el cliente

Cosas que el código migra tal cual porque así están en el diseño, pero que no se
pueden dar por definitivas sin que ÚRBIT LAB las confirme. Ninguna de ellas bloquea
el avance de la migración — se listan para no perderlas de vista antes de publicar.

## Contenido

- **Métricas del hero** (`08` líneas de servicio, `05` disciplinas integradas,
  `06` sectores de impacto, `04` escalas de intervención): el propio diseñador las
  marcó como cifras de ejemplo en `design-source/ASTRO.md`. Confirmar los valores
  reales antes de publicar. Viven en `src/data/site.ts` (`HERO_METRICS`) para que
  cambiarlas sea editar un solo archivo.
- **Teléfono** (`311 448 1160` / `tel:+573114481160`) y **correo**
  (`comunidad@clapedu.org`) del pie: también marcados como placeholder por el
  diseñador. Viven en `src/data/site.ts` (`CONTACT`).
- **Enlace de WhatsApp** (`https://api.whatsapp.com/send/?phone=3114481160&...`):
  se repite en nav, menú móvil, hero y 3 secciones más. Confirmar que el número
  `3114481160` es el definitivo antes de publicar.

## Discrepancia encontrada vs. las notas históricas

- `design-source/ASTRO.md` decía *"los reels enlazan al perfil de Instagram, no a
  posts individuales"*. Verificado directo en el HTML: **no es así** — cada una de
  las 4 tarjetas de reel (`#c-lab`) tiene su propio `href` a un post específico
  (`/p/Daardg4x0Vh/`, `/p/DaobQRFRHIm/`, `/p/Da-o1jBB8qb/`, `/p/DbQqY94Bvol/`). Lo
  que sí enlaza al perfil genérico (`instagram.com/urbitlab/`) es el botón
  "@urbitlab en Instagram ↗" del encabezado de esa misma sección, y el enlace
  "INSTAGRAM ↗" del pie. Se migran ambos comportamientos tal como están en el
  código (perfil arriba y en el pie, posts individuales en cada tarjeta) — dejo
  esto anotado por si el cliente esperaba lo contrario según el brief original.
  Pendiente: confirmar que esos 4 posts de Instagram siguen publicados/vigentes.

## JS de scroll/animación

- Implementadas 8 de las 9 features identificadas (ver `CLAUDE.md`). **Descartada
  a propósito:** el texto cinético original (palabra por palabra) — se reemplazó
  por un revelado a nivel de bloque (`clip-path` + `transform`) que logra el mismo
  efecto visual sin partir los `<h2>` en múltiples `<span>`, protegiendo
  accesibilidad y mantenibilidad del copy.
- Dos comportamientos no obvios del original, replicados literal: el CTA de
  Contacto nunca se anima (su selector original apunta a un `href` que no existe)
  y el color de texto de las tarjetas de Metodología se normaliza por herencia
  cuando la tarjeta se activa — ambos documentados con detalle en `CLAUDE.md`.

## Verificación final — sin ejecutar el diff automatizado con Playwright

El plan original (ver `CLAUDE.md`, "Verificación final") preveía instalar
Playwright y comparar capturas del original congelado contra el build, por
sección, en 1440/834/390px, con un % de píxeles distintos por sección. **Esto no
se llegó a implementar** — la verificación de cada fase se hizo manualmente
sección por sección y ancho por ancho (capturas + estado computado real en
Chrome), no con un diff automatizado y reproducible. Si se quiere el diff
automatizado como entregable, sigue pendiente instalar Playwright, congelar las
capturas de referencia del original (recordar: `support.js` depende de
`unpkg.com`, no renderiza standalone sin red) y escribir el script de comparación.

## Assets sin uso actual

- `logo-dark.png` y `mark-light.png` existen en `design-source/assets/` pero
  ningún nodo del HTML v2 los referencia (eran para una variante de hero oscura
  de una versión anterior del diseño). No se importan a `src/assets/`. Si en algún
  momento se agrega un modo oscuro al sitio, ya están disponibles ahí.

## Head / metadatos

- **Favicon: resuelto** (Fase 11) — generado a partir de `mark-dark.png`,
  referenciado en `BaseLayout.astro`.
- **Pendiente:** `og:image`, Twitter Card y JSON-LD. El diseño original no trae
  ninguno de estos en su `<head>`, así que no se inventaron. Si el cliente los
  quiere para compartir en redes/buscadores, es una fase nueva a definir con
  contenido real (imagen de OG, descripción, etc.), no derivable del diseño.
