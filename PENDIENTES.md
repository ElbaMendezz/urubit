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

- **Favicon: reemplazado por instrucción directa del cliente.** El favicon de
  la Fase 11 (generado a partir de `mark-dark.png`, el mark oscuro) fue
  sustituido por uno generado a partir del asset que el cliente marcó como
  "definitivo" (`public/urbit-favico.png`, subido por el usuario — confirmado
  por muestreo de píxeles que es idéntico a `design-source/assets/mark-light.png`,
  el mark *claro*, pensado originalmente para fondo oscuro). `favicon.ico`,
  `favicon.png` y `apple-touch-icon.png` se regeneraron con el mismo
  tratamiento de la Fase 11 (recorte al bbox de contenido, centrado sobre lienzo
  transparente) pero a partir de este mark claro en vez del oscuro. El archivo
  fuente (`public/urbit-favico.png`) se borró después de generarlos —su
  contenido ya vive permanentemente en `design-source/assets/mark-light.png`,
  y dejarlo en `public/` habría quedado como URL pública muerta sin referenciar
  (el mismo problema que tuvo el jpeg anterior).
  **Riesgo visual confirmado y aceptado explícitamente por el cliente:** al ser
  un mark blanco sobre fondo transparente, se ve prácticamente invisible en
  pestañas de navegador con tema claro (el caso más común) y de muy bajo
  contraste sobre gris claro — solo se ve con nitidez sobre fondos oscuros.
  Verificado con composites sobre blanco/gris/oscuro antes de implementar. Se
  preguntó explícitamente si usar el mark oscuro en su lugar o generar un
  fondo de marca detrás del claro; el cliente eligió implementarlo tal cual.
- **Title, meta description, keywords, Open Graph, Twitter Card: RESUELTO** —
  copy SEO definitivo entregado por el cliente, implementado tal cual en
  `BaseLayout.astro` (ya no es el placeholder derivado del copy del Hero de
  las Fases 11-12).
  - **Title acortado:** el que envió el cliente medía 83 caracteres; el
    límite pedido es 65. Se recortó a 63 quitando "innovación social" del
    final, manteniendo el resto exacto (mismas palabras y orden, nada
    agregado): `"ÚRBIT LAB | Arquitectura, urbanismo, ingeniería, sostenibilidad"`.
    Confirmar con el cliente que este recorte es aceptable.
  - El keyword "innovación social" viene duplicado en la lista que envió el
    cliente (aparece dos veces) — se implementó literal, sin corregirlo por
    cuenta propia; avisar al cliente por si fue un error de tipeo de su parte.
  - `og:site_name` y el `name` del JSON-LD usan "ÚRBIT LAB" en mayúsculas,
    igual que el título entregado por el cliente — esto es solo para
    metadatos/SEO, **no** cambia cómo se muestra la marca en el sitio visible
    (nav/footer siguen con "Úrbit Lab", que es el diseño aprobado).
  - `og:url` y `<link rel="canonical">` se omiten a propósito: el sitio no
    tiene dominio de producción real todavía. Por la misma razón, `og:image`/
    `twitter:image` usan ruta relativa (`/og-image.png`) en vez de absoluta;
    revisar cuando haya dominio real (algunos scrapers, notablemente Facebook,
    prefieren URLs absolutas de imagen).
  - El JSON-LD (`Organization`) solo usa datos ya existentes en `CONTACT`
    (`src/data/site.ts`): nombre, teléfono, correo, Instagram. Sin dirección,
    fecha de fundación ni logo (no hay URL estable de logo fuera de
    `astro:assets`).
- **`og:image`/`twitter:image`: sigue PROVISIONAL.** Apuntan a
  `public/og-image.png`, generado (fondo `#1E2A23` + `logo-light.png`
  centrado, 1200×630) — el cliente no envió una pieza definitiva junto con el
  copy SEO. Reemplazar cuando la entregue.
