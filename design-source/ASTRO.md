> **HISTÓRICO.** Estas son las notas originales del diseñador, dejadas dentro del propio
> canvas `.dc.html`. Se conservan aquí como contexto de por qué se tomaron ciertas decisiones,
> pero ya no son la referencia activa del proceso de migración: la fuente única de verdad
> a partir de ahora es `/CLAUDE.md` en la raíz del repo, que documenta el despiece real,
> las convenciones acordadas y el estado fase a fase. Ante cualquier discrepancia entre este
> archivo y `/CLAUDE.md`, gana `/CLAUDE.md`.

# ÚRBIT LAB — notas de migración a Astro

## Breakpoints
- Escritorio: ≥ 1025px
- Tablet: 641–1024px
- Móvil: ≤ 640px

El responsive vive en **un solo bloque `<style>`** con media queries que atacan atributos `data-r`
(`grid4`, `grid2`, `row-head`, `pad-sec`, `pad-card`, `pad-x`, `hero`, `hero-foot`, `hero-tags`,
`footer-row`, `footer-cols`, `reel`, `fase`, `svc`, `cta`, `tap`, `nolinebreak`, `nav-links`,
`nav-burger`, `nav-cta`). El resto del estilo es inline, así que cada sección se puede mover a un
`.astro` sin arrastrar CSS global: copiar solo las reglas `data-r` que use esa sección a su
`<style>` scoped.

## Estructura sugerida
```
src/
  layouts/Base.astro        <- <head>, fuentes, el bloque de media queries global
  components/
    Nav.astro               <- nav + menú móvil (única isla con JS)
    Hero.astro              <- #top
    Metricas.astro
    Lab.astro               <- #c-lab
    Servicios.astro         <- #c-hacemos
    Diferencia.astro        <- #c-dif
    Metodologia.astro       <- #c-metodo
    Acompanamiento.astro    <- #c-aliado
    Contacto.astro          <- #c-contacto
  pages/index.astro
  assets/                   <- las imágenes de /assets
```
Los `id` de sección son los anclas del nav; no renombrarlos sin actualizar los `href`.

## Imágenes
Todas están en `assets/`. Pasar a `src/assets/` y usar `astro:assets`:
```astro
import { Image } from 'astro:assets';
import hero from '../assets/hero-render.png';
```
Los fondos (`hero-render`, `dif-collage`, `contacto-collage`, `svc-01…08`, `reel-01…04`) van por CSS:
convertir a `.webp` y servir con `background-image` en el `<style>` scoped del componente.
Los logos (`logo-dark`, `logo-light`, `mark-dark`, `mark-light`) son PNG con transparencia; ideal
reemplazarlos por SVG cuando el estudio los tenga.

## JavaScript
Un único script de scroll: intro del hero, contadores, scroll-reveal, texto cinético, foco por fase
en metodología, parallax de fondos y botón "volver arriba". Sin dependencias externas.
En Astro: `<script>` normal en `Base.astro` (se hidrata solo en cliente) con
`window.matchMedia('(prefers-reduced-motion: reduce)')` como guarda para desactivar el movimiento.
El menú móvil es el único componente con estado: `Nav.astro` + un `<script>` de ~15 líneas.

## Pendientes de contenido
- Métricas (08 / 05 / 06 / 04) son de ejemplo: confirmar cifras reales.
- Los reels enlazan al perfil de Instagram, no a posts individuales.
- Teléfono y correo del pie son placeholders.
