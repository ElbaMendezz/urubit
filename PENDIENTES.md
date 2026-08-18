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

## Técnico, para la fase de verificación final

- El HTML original (`.dc.html`) no renderiza standalone sin red: `support.js` carga
  React, ReactDOM y Babel Standalone desde `unpkg.com` en tiempo de ejecución. Para
  el diff de Playwright de la fase final, congelamos capturas de referencia (por
  sección, animaciones en estado final, a 1440/834/390px) mientras haya una sesión
  con red disponible, en vez de depender de `unpkg.com` en cada corrida. Acordado,
  no bloqueante — se ejecuta en su momento.
- 9 features de JS de scroll/animación pendientes de decisión costo/beneficio
  (mantenimiento + impacto en CLS) antes de portarlas — se deciden en la fase de
  JS dedicada, no antes.

## Assets sin uso actual

- `logo-dark.png` y `mark-light.png` existen en `design-source/assets/` pero
  ningún nodo del HTML v2 los referencia (eran para una variante de hero oscura
  de una versión anterior del diseño). No se importan a `src/assets/`. Si en algún
  momento se agrega un modo oscuro al sitio, ya están disponibles ahí.

## Head / metadatos

- Favicon, `og:image`, Twitter Card y JSON-LD: el diseño no trae ninguno de estos
  en su `<head>`. Se dejan fuera del layout hasta la fase dedicada a `<head>`
  (última fase del plan, antes de la verificación final) — no se inventan ahora.
